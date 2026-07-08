# SimpliiGood Challenge — פאזה 1

עמוד "איך משתמשים בספירולינה" + ספריית מתכונים. עברית, RTL, מובייל-פרסט.
Next.js 14 · TypeScript · TailwindCSS · Supabase (אופציונלי בפאזה 1) · Vercel.

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
2. SQL Editor → מריצים את `supabase/schema.sql`.
3. ב-Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — מ-Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — service_role key (סודי! לעולם לא בצד לקוח — אצלנו הוא רק ב-API route)
4. Redeploy.

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

- **פאזה 2** — אתגר 14 יום אישי (בלי לידרבורד): Supabase Auth ב-SMS, מסך "המסע שלי", streak. "הכנתי!" הופך לנקודות — ה-API route כבר בנוי לזה.
- **פאזה 3** — UGC, פיד השראה, קופונים.
- **פאזה 4** — אדמין, וואטסאפ אוטומטי, AI.
