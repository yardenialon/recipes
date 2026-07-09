-- ============================================================
-- SimpliiGood Challenge — סכימה
-- פאזה 1: recipe_completions — מונה "הכנתי!" אנונימי
-- פאזה 2: challenge_progress + RPC — אתגר 14 יום אישי לפי מכשיר
-- הקובץ אידמפוטנטי (if not exists / or replace) — אפשר להריץ אותו שוב בבטחה.
-- ============================================================

-- ---------- פאזה 1 ----------
create table if not exists recipe_completions (
  id          bigint generated always as identity primary key,
  recipe_slug text not null check (char_length(recipe_slug) <= 64),
  created_at  timestamptz not null default now()
);

create index if not exists idx_completions_slug_time
  on recipe_completions (recipe_slug, created_at desc);

-- RLS: אין קריאה/כתיבה ציבורית — רק service role (ה-API route) ניגש
alter table recipe_completions enable row level security;

-- ---------- פאזה 2 — אתגר 14 יום ----------
-- מעקב אנונימי לפי device_id שנוצר בדפדפן. בלי לידרבורד, בלי PII.
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

alter table challenge_progress enable row level security;

-- רישום "הכנתי!" ליום הנוכחי (שעון ישראל) + עדכון streak ונקודות, אטומי.
-- כל הכנה שווה 10 נקודות; כל יום נספר פעם אחת בלבד; פער מאפס את הרצף.
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
