# SimpliiGood Challenge

עמוד "איך משתמשים בספירולינה" + ספריית מתכונים, אתגר 14 יום אישי, תגמולים, העלאות משתמשים ופאנל אדמין.
עברית, RTL, מובייל-פרסט. Next.js 14 · TypeScript · TailwindCSS · Supabase · Vercel.

האתר רץ במלואו גם **בלי** Supabase (מתכונים, חיפוש, SEO, "הכנתי!" בצד לקוח). Supabase מוסיף שמירה, מסע/streak, נקודות והעלאות.

## הרצה מקומית

```bash
npm install
npm run dev
# http://localhost:3000
```

## פריסה ל-Vercel (5 דקות)

1. דוחפים את התיקייה לריפו GitHub **בחשבון שלך** (לא של צוות הפיתוח — לקח מהאתר הקיים).
2. ב-Vercel: New Project → בוחרים את הריפו → Deploy. אין הגדרות מיוחדות.
3. Domain: מוסיפים את תת-הדומיין (למשל `challenge.simpliigood.co.il`) ב-Settings → Domains, ומוסיפים רשומת CNAME אצל רשם הדומיין.

זהו. העמוד עובד במלואו גם בלי Supabase.

## חיבור Supabase (מתי שנוח — לא חוסם השקה)

בלי Supabase, "הכנתי!" עובד בצד לקוח (קונפטי + מונה) אבל לא נשמר לאורך זמן.

1. פרויקט חדש ב-supabase.com.
2. SQL Editor → מריצים את `supabase/schema.sql` (אידמפוטנטי — כולל את כל הפאזות: מונה, אתגר 14 יום, והעלאות UGC + bucket).
3. ב-Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — מ-Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — service_role key (סודי! לעולם לא בצד לקוח — אצלנו הוא רק ב-API routes)
   - `ADMIN_TOKEN` — סיסמה אקראית וחזקה לפאנל האדמין (`/admin`). בלעדיה הפאנל מושבת.
4. Redeploy.

### פאנל אדמין ופיד

- `/admin` — מודרציה של תמונות משתמשים (אישור/דחייה). מוגן ב-`ADMIN_TOKEN`.
- `/feed` — פיד ציבורי של התמונות שאושרו.
- `/journey` — מסע ה-14 יום האישי (אנונימי לפי מכשיר): streak, ימים, נקודות, תגים, והעלאת תמונה.

## שני דברים להחליף לפני השקה

בקובץ `lib/recipes.ts`, שתי השורות האחרונות:

```ts
export const WHATSAPP_LINK = "https://chat.whatsapp.com/REPLACE_ME";
export const SHOP_LINK = "https://simpliigood.com";
```

## הוספת תמונות אמיתיות (אחרי יום הצילום)

1. שמים את הקבצים ב-`public/recipes/` (יחס 4:3, WebP מומלץ, עד ~150KB).
2. ב-`lib/recipes.ts` מעדכנים לכל מתכון: `image: "/recipes/green-yogurt.webp"`.
3. כל עוד `image: null` — מוצג placeholder ירקרק מסומן 📷 (עומד בכלל "אין תמונות AI").

## הוספת מתכון חדש

עורכים את המערך `RECIPES` ב-`lib/recipes.ts` — טיפוס `Recipe` מכתיב את כל השדות. אין צורך בקוד נוסף; החיפוש, הרמות וה-JSON-LD מתעדכנים אוטומטית.

## מה כבר בפנים

- **SEO:** metadata מלא בעברית + Schema.org Recipe markup לכל המתכונים (JSON-LD).
- **"הכנתי!":** קונפטי, נעילה עד חצות (localStorage), מונה, שמירה אנונימית ל-DB אם מחובר.
- **חיפוש** בשם/מרכיב/תגית + מצב ריק שמפנה לוואטסאפ (ערוץ backlog מתכונים).
- **נגישות:** aria בכל האינטראקציות, prefers-reduced-motion, ניגודיות לפי שלב העיצוב.
- **Bottom Sheet** למתכון במובייל / מודאל בדסקטופ, לפי האפיון.

## אופטימיזציה אחרי פריסה (לא דחוף)

הפונט Heebo נטען כרגע מ-Google Fonts ב-link. אחרי הפריסה אפשר לעבור ל-`next/font/google` ב-`app/layout.tsx` ל-self-hosting אוטומטי (שיפור LCP קטן). ההערה בקוד מסמנת את המקום.

## מפת דרכים (מה-PRD)

- ✅ **פאזה 1** — עמוד + ספריית מתכונים, SEO/JSON-LD, "הכנתי!".
- ✅ **פאזה 2** — אתגר 14 יום אישי (אנונימי לפי מכשיר, בלי לידרבורד): מסך "המסע שלי", streak, נקודות.
- ✅ **פאזה 3** — תגמולים ותגי הישג, קופון לפי נקודות (`lib/rewards.ts`), והעלאות תמונה של משתמשים (נקודות, ממתין לאישור).
- ✅ **פאזה 4** — פאנל אדמין למודרציה + פיד קהילה.

### פתוח / לעתיד

- **התחברות SMS** — כרגע המסע אנונימי לפי מכשיר (לא עובר בין מכשירים). Supabase Auth ב-SMS יאחד חשבון בין מכשירים ויאפשר יצירת קשר.
- **קופון אמיתי** — `REWARD` ב-`lib/rewards.ts` הוא placeholder (`SIMPLII10`) — להחליף במבצע אמיתי.
- **וואטסאפ אוטומטי / AI** — תזכורות streak, פיד השראה מונחה.
- **סרטונים ב-UGC** — כרגע תמונות בלבד.
