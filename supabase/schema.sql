-- ============================================================
-- SimpliiGood Challenge — סכימת פאזה 1 (מינימלית בכוונה)
-- טבלאות פאזה 2-3 (users, points, coupons, uploads) יתווספו
-- כשהפיצ'רים נבנים — לא מתחזקים טבלאות ריקות.
-- ============================================================

create table if not exists recipe_completions (
  id          bigint generated always as identity primary key,
  recipe_slug text not null check (char_length(recipe_slug) <= 64),
  created_at  timestamptz not null default now()
);

create index if not exists idx_completions_slug_time
  on recipe_completions (recipe_slug, created_at desc);

-- RLS: אין קריאה/כתיבה ציבורית — רק service role (ה-API route) כותב
alter table recipe_completions enable row level security;
