-- ============================================================
-- SimpliiGood Challenge — סכימה
-- פאזה 1: recipe_completions — מונה "הכנתי!" אנונימי
-- פאזה 2: challenge_progress + RPC — אתגר 14 יום אישי לפי מכשיר
-- פאזה 3: ugc_uploads + storage — העלאות תמונה של משתמשים (נקודות, ממתין לאישור)
-- הקובץ אידמפוטנטי (if not exists / or replace / add column if not exists) — אפשר להריץ שוב.
-- ============================================================

-- ---------- פאזה 1 ----------
create table if not exists recipe_completions (
  id          bigint generated always as identity primary key,
  recipe_slug text not null check (char_length(recipe_slug) <= 64),
  created_at  timestamptz not null default now()
);

create index if not exists idx_completions_slug_time
  on recipe_completions (recipe_slug, created_at desc);

alter table recipe_completions enable row level security;

-- ---------- פאזה 2 — אתגר 14 יום ----------
create table if not exists challenge_progress (
  device_id      text primary key check (char_length(device_id) between 8 and 64),
  started_at     date not null default (timezone('Asia/Jerusalem', now())::date),
  last_day       date,
  days_completed int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  points         int not null default 0,
  updated_at     timestamptz not null default now()
);

-- פאזה 3: עמודה למעקב תקרת נקודות יומית על העלאות
alter table challenge_progress add column if not exists last_upload_day date;

alter table challenge_progress enable row level security;

-- רישום "הכנתי!" ליום הנוכחי (שעון ישראל) + עדכון streak ונקודות, אטומי.
create or replace function record_challenge_day(p_device_id text)
returns challenge_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := timezone('Asia/Jerusalem', now())::date;
  r     challenge_progress;
begin
  select * into r from challenge_progress where device_id = p_device_id;

  if not found then
    insert into challenge_progress
      (device_id, started_at, last_day, days_completed, current_streak, longest_streak, points)
    values (p_device_id, today, today, 1, 1, 1, 10)
    returning * into r;
    return r;
  end if;

  r.points := r.points + 10; -- כל הכנה = נקודות

  if r.last_day = today then
    null; -- כבר נספר יום היום — מוסיפים רק נקודות
  elsif r.last_day = today - 1 then
    r.current_streak := r.current_streak + 1;
    r.days_completed := r.days_completed + 1;
    r.last_day := today;
  else
    r.current_streak := 1; -- פער בימים — הרצף מתחיל מחדש
    r.days_completed := r.days_completed + 1;
    r.last_day := today;
  end if;

  r.longest_streak := greatest(r.longest_streak, r.current_streak);
  r.updated_at := now();

  update challenge_progress set
    last_day       = r.last_day,
    days_completed = r.days_completed,
    current_streak = r.current_streak,
    longest_streak = r.longest_streak,
    points         = r.points,
    updated_at     = r.updated_at
  where device_id = p_device_id
  returning * into r;

  return r;
end;
$$;

-- ---------- פאזה 3 — העלאות תמונה (UGC) ----------
-- מדיה נשמרת ב-storage פרטי וממתינה לאישור (status='pending'); אין תצוגה ציבורית.
create table if not exists ugc_uploads (
  id           bigint generated always as identity primary key,
  device_id    text not null check (char_length(device_id) between 8 and 64),
  storage_path text not null,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now()
);

create index if not exists idx_ugc_status_time on ugc_uploads (status, created_at desc);

-- שם תצוגה אופציונלי לקרדיט בפיד (לא PII מזהה — כינוי בלבד)
alter table ugc_uploads add column if not exists display_name text;

alter table ugc_uploads enable row level security;

-- bucket פרטי להעלאות. גישה רק דרך service role (ה-API route) — אין קריאה ציבורית.
insert into storage.buckets (id, name, public)
values ('ugc', 'ugc', false)
on conflict (id) do nothing;

-- רישום העלאה + הענקת נקודות עם תקרה יומית (רק ההעלאה הראשונה ביום מזכה).
-- מחזיר json: awarded + שדות ה-progress.
drop function if exists record_upload(text, text);
create or replace function record_upload(p_device_id text, p_path text, p_name text default null)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  today   date := timezone('Asia/Jerusalem', now())::date;
  r       challenge_progress;
  awarded boolean := false;
begin
  insert into ugc_uploads (device_id, storage_path, display_name)
  values (p_device_id, p_path, nullif(btrim(coalesce(p_name, '')), ''));

  select * into r from challenge_progress where device_id = p_device_id;

  if not found then
    insert into challenge_progress (device_id, started_at, last_upload_day, points)
    values (p_device_id, today, today, 20)
    returning * into r;
    awarded := true;
  elsif r.last_upload_day is null or r.last_upload_day < today then
    r.points := r.points + 20;
    r.last_upload_day := today;
    awarded := true;
    update challenge_progress set
      points = r.points, last_upload_day = r.last_upload_day, updated_at = now()
    where device_id = p_device_id
    returning * into r;
  end if;

  return json_build_object(
    'awarded',        awarded,
    'days_completed', r.days_completed,
    'current_streak', r.current_streak,
    'longest_streak', r.longest_streak,
    'points',         r.points,
    'started_at',     r.started_at,
    'last_day',       r.last_day
  );
end;
$$;

-- ---------- איחוד זהות לפי טלפון ----------
-- ממזג את שורת המכשיר האנונימי (p_device_id) לשורת זהות-הטלפון (p_phone_id,
-- שהוא hash לא-הפיך של הטלפון), כדי שהמסע יעקוב אחרי המשתמש בכל מכשיר.
-- הטלפון עצמו לא נשמר — רק ה-hash שמגיע כ-device_id.
create or replace function link_phone(p_device_id text, p_phone_id text)
returns challenge_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  d challenge_progress;
  p challenge_progress;
  r challenge_progress;
begin
  select * into p from challenge_progress where device_id = p_phone_id;

  -- כבר מקושר (אותו מזהה) — אין מה למזג
  if p_device_id = p_phone_id then
    return p;
  end if;

  select * into d from challenge_progress where device_id = p_device_id;
  if not found then
    return p; -- אין התקדמות אנונימית להעביר
  end if;

  if p.device_id is null then
    -- אין עדיין שורת טלפון: מעבירים את שורת המכשיר לזהות-הטלפון
    insert into challenge_progress
      (device_id, started_at, last_day, days_completed, current_streak, longest_streak, points, last_upload_day, updated_at)
    values
      (p_phone_id, d.started_at, d.last_day, d.days_completed, d.current_streak, d.longest_streak, d.points, d.last_upload_day, now())
    returning * into r;
  else
    -- ממזגים את שתי השורות (greatest/least מדלגים על NULL)
    update challenge_progress set
      started_at      = least(p.started_at, d.started_at),
      last_day        = greatest(p.last_day, d.last_day),
      days_completed  = greatest(p.days_completed, d.days_completed),
      current_streak  = greatest(p.current_streak, d.current_streak),
      longest_streak  = greatest(p.longest_streak, d.longest_streak),
      points          = p.points + d.points,
      last_upload_day = greatest(p.last_upload_day, d.last_upload_day),
      updated_at      = now()
    where device_id = p_phone_id
    returning * into r;
  end if;

  -- מוחקים את שורת המכשיר האנונימי כדי למנוע ספירה כפולה
  delete from challenge_progress where device_id = p_device_id;

  return r;
end;
$$;
