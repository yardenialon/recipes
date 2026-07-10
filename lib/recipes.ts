// ============================================================
// שכבת הנתונים — פאזה 1: מתכונים סטטיים (SSG מושלם ל-SEO)
// המתכונים לקוחים מחומרי SimpliiGood הרשמיים — כולם קרים (בלי חימום).
// תמונות: קבצי WebP ב-public/recipes/ — לכל המתכונים יש תמונה אמיתית.
// בפאזה 2 השכבה הזו עוברת לטבלת recipes ב-Supabase — הטיפוס נשאר זהה.
// ============================================================

export type Level = 1 | 2 | 3 | 4;

export const LEVELS: { id: Level; emoji: string; label: string; title: string }[] = [
  { id: 1, emoji: "⚡", label: "10 שניות", title: "מתכוני 10 שניות" },
  { id: 2, emoji: "🥤", label: "דקה", title: "מתכוני דקה" },
  { id: 3, emoji: "🍽️", label: "5 דקות", title: "מתכוני 5 דקות" },
  { id: 4, emoji: "👨‍🍳", label: "שווה את זה", title: "שווה את ההשקעה" },
];

export type Meal = "בוקר" | "צהריים" | "ערב" | "ביניים";

export interface Recipe {
  slug: string;
  name: string;
  level: Level;
  timeLabel: string;
  cubes: 1 | 2 | 3;
  meal: Meal;
  ingredients: string[];
  steps: string[];
  nutrition: string;
  tags: string[];
  /** מונה בסיס עד שה-API צובר נתונים אמיתיים */
  baseMadeCount: number;
  /** נתיב תמונה אמיתית — null עד שהתמונות עולות ל-public/recipes/ */
  image: string | null;
}

export const RECIPES: Recipe[] = [
  // ===== רמה 1 — 10 שניות =====
  {
    slug: "green-yogurt",
    name: "יוגורט ירוק של בוקר",
    level: 1, timeLabel: "10 שנ'", cubes: 2, meal: "בוקר",
    ingredients: ["גביע יוגורט טבעי", "2 מנות SimpliiGood מופשרות", "כפית דבש (אופציונלי)"],
    steps: ["מערבבים 2 מנות היישר בתוך היוגורט — הן מתרככות תוך שניות", "מוסיפים כפית דבש אם בא לכם", "זהו. באמת."],
    nutrition: "חלבון מלא · B12 · ברזל",
    tags: ["ילדים", "חלבון"],
    baseMadeCount: 156, image: "/recipes/green-yogurt.webp",
  },
  {
    slug: "orange-spirulina",
    name: "מיץ תפוזים ספירולינה",
    level: 1, timeLabel: "10 שנ'", cubes: 1, meal: "בוקר",
    ingredients: ["כוס מיץ תפוזים סחוט", "מנה SimpliiGood מופשרת"],
    steps: ["מערבבים מנה מופשרת לתוך כוס מיץ התפוזים", "מערבבים היטב (או בבלנדר) עד מרקם הומוגני", "מיץ תפוזים ירוק ומתוק — מוכן"],
    nutrition: "ויטמין C · ברזל · נוגדי חמצון",
    tags: ["ילדים", "טבעוני"],
    baseMadeCount: 76, image: "/recipes/orange-spirulina.webp",
  },
  {
    slug: "tuna-spirulina",
    name: "סלט טונה וספירולינה",
    level: 1, timeLabel: "10 שנ'", cubes: 1, meal: "צהריים",
    ingredients: ["קופסת טונה", "מנה SimpliiGood מופשרת (במקום מיונז)", "מלח ופלפל לפי הטעם"],
    steps: ["מחליפים את המיונז במנה מופשרת", "מערבבים היטב", "מקבלים חלבון צמחי ונוגדי חמצון נוספים"],
    nutrition: "חלבון · נוגדי חמצון · אומגה 3",
    tags: ["חלבון"],
    baseMadeCount: 41, image: "/recipes/tuna-spirulina.webp",
  },
  {
    slug: "avocado-spirulina",
    name: "ספירולינה אבוקדו",
    level: 1, timeLabel: "10 שנ'", cubes: 1, meal: "ביניים",
    ingredients: ["אבוקדו בשל (או הגוואקמולה האהובה עליכם)", "מנה SimpliiGood מופשרת", "לימון, מלח, פלפל"],
    steps: ["מוסיפים מנה מופשרת למתכון האבוקדו המקורי", "מערבבים היטב למחית חלקה", "מגישים עם ירקות או קרקרים"],
    nutrition: "שומן בריא · ברזל · חומצה פולית",
    tags: ["טבעוני", "קטו"],
    baseMadeCount: 59, image: "/recipes/avocado-spirulina.webp",
  },
  {
    slug: "green-hummus",
    name: "חומוס ספירולינה",
    level: 1, timeLabel: "10 שנ'", cubes: 1, meal: "צהריים",
    ingredients: ["3 כפות חומוס מוכן", "מנה SimpliiGood מופשרת", "שמן זית, פפריקה"],
    steps: ["מערבבים את המנה בחומוס", "מזליפים שמן זית", "נגיעת פפריקה ומוכן"],
    nutrition: "חלבון · ברזל · סיבים",
    tags: ["טבעוני"],
    baseMadeCount: 77, image: "/recipes/green-hummus.webp",
  },
  // ===== רמה 2 — דקה =====
  {
    slug: "protein-banana-shake",
    name: "שייק חלבון בננה ספירולינה",
    level: 2, timeLabel: "דקה", cubes: 2, meal: "ביניים",
    ingredients: ["2 מנות SimpliiGood טרייה", "בננה קפואה או טרייה", "חופן בייבי תרד טרי", "2 כפות זרעי פשתן (מעל)", "כף אבקת חלבון (לא חובה)", "3/4 כוס חלב שקדים או נוזל אחר"],
    steps: ["מכניסים את כל הרכיבים למעבד מזון או בלנדר", "טוחנים עד נוזל סמיך אך חלק", "מפזרים זרעי פשתן מעל ומגישים"],
    nutrition: "חלבון מלא · BCAA · ברזל · B12",
    tags: ["חלבון", "פיטנס"],
    baseMadeCount: 143, image: "/recipes/protein-banana-shake.webp",
  },
  {
    slug: "buddha-bowl",
    name: "בודהה בול ספירולינה",
    level: 2, timeLabel: "דקה", cubes: 2, meal: "בוקר",
    ingredients: ["2 מנות SimpliiGood טרייה", "בננה קפואה", "6–8 תותים קפואים", "כף גדושה חמאת בוטנים או אבקת חלבון", "1/2 כוס חלב או חלב צמחי", "לקישוט: פירות טריים"],
    steps: ["חשוב שכל הפירות יהיו קפואים לחלוטין", "טוחנים את כל החומרים במעבד מזון עד מרקם חלק ואחיד ללא גושים", "מעבירים לקערה, מקשטים בפירות טריים ומגישים מיד"],
    nutrition: "חלבון · ברזל · ויטמין C",
    tags: ["ילדים", "אינסטגרם"],
    baseMadeCount: 118, image: "/recipes/buddha-bowl.webp",
  },
  // ===== רמה 3 — 5 דקות =====
  {
    slug: "fresh-tahini",
    name: "טחינה ספירולינה טרייה",
    level: 3, timeLabel: "5 דק'", cubes: 2, meal: "צהריים",
    ingredients: ["2 מנות SimpliiGood טרייה", "1/2 כוס טחינה גולמית", "2 שיני שום קלופות", "צרור פטרוזיליה או כוסברה", "מיץ מלימון", "1/4 כפית מלח ופלפל שחור", "כוס מים"],
    steps: ["מכניסים את כל המרכיבים למעבד מזון או בלנדר", "טוחנים עד מרקם חלק ומהמם", "מדללים במים לפי הצורך"],
    nutrition: "סידן · ברזל · חלבון מלא",
    tags: ["טבעוני", "ללא גלוטן"],
    baseMadeCount: 88, image: "/recipes/fresh-tahini.webp",
  },
  {
    slug: "salad-dressing",
    name: "רוטב סלט ספירולינה טרי",
    level: 3, timeLabel: "5 דק'", cubes: 2, meal: "צהריים",
    ingredients: ["2 מנות SimpliiGood טרייה", "מיץ מחצי תפוז", "מיץ מחצי לימון", "2 כפות דבש או סירופ מייפל", "כפית חרדל", "3 כפות שמן זית", "מלח ופלפל לפי הטעם"],
    steps: ["מכניסים את כל החומרים לצנצנת", "מנערים היטב עד מרקם חלק ואחיד", "מזלפים על כל סלט"],
    nutrition: "נוגדי חמצון · ברזל · ויטמין C",
    tags: ["טבעוני"],
    baseMadeCount: 52, image: "/recipes/salad-dressing.webp",
  },
  {
    slug: "green-pesto",
    name: "ממרח פסטו ספירולינה",
    level: 3, timeLabel: "5 דק'", cubes: 2, meal: "ערב",
    ingredients: ["חופן בזיליקום", "2 מנות SimpliiGood טרייה", "3 כפות שמן זית", "כף צנוברים או אגוזי מלך", "שן שום", "פרמזן (אופציונלי)"],
    steps: ["מכניסים את כל החומרים למעבד מזון", "פולסים עד מרקם גס", "מגישים על לחם, בסלט פסטה קר, או כמטבל"],
    nutrition: "נוגדי חמצון · ברזל · שומן בריא",
    tags: ["טבעוני", "משפחה"],
    baseMadeCount: 47, image: "/recipes/green-pesto.webp",
  },
  // ===== רמה 4 — שווה את ההשקעה =====
  {
    slug: "chia-pudding",
    name: "פודינג ספירולינה צ'יה",
    level: 4, timeLabel: "לילה במקרר", cubes: 2, meal: "בוקר",
    ingredients: ["2 מנות SimpliiGood טרייה", "בננה וחצי מעוכה", "2 כפות זרעי צ'יה", "כף חמאת שקדים או פיסטוק", "1/4 כוס קרם קוקוס", "1/2 כוס חלב שקדים או צמחי לבחירתכם", "לקישוט: יוגורט, פיסטוקים קצוצים, פירות אהובים"],
    steps: ["מערבבים את כל החומרים בקערה — הכל קר", "מכניסים למקרר ללילה או לכמה שעות עד שהתערובת מסמיכה", "מעבירים לכלי הגשה ומקשטים ביוגורט, פיסטוקים ופירות"],
    nutrition: "אומגה 3 (צ'יה) · חלבון מלא · ברזל",
    tags: ["טבעוני", "ילדים"],
    baseMadeCount: 64, image: "/recipes/chia-pudding.webp",
  },
  {
    slug: "yogurt-bark",
    name: "חטיפי יוגורט ספירולינה",
    level: 4, timeLabel: "10 דק' + הקפאה", cubes: 2, meal: "ביניים",
    ingredients: ["2 מנות SimpliiGood טרייה", "2 כוסות יוגורט לבחירתכם (גם ללא חלב עובד)", "תוספות כיד הדמיון: שוקולד לבן מומס, אוכמניות, קוקוס טחון, פיסטוקים כתושים"],
    steps: ["מערבבים יוגורט וספירולינה למרקם אחיד", "מורחים על משטח מרופד בנייר אפייה", "מפזרים תוספות מועדפות", "מקפיאים 3 שעות ומעלה ופורסים לחטיפים"],
    nutrition: "פרוביוטיקה · חלבון · נוגדי חמצון",
    tags: ["ילדים", "קיץ"],
    baseMadeCount: 97, image: "/recipes/yogurt-bark.webp",
  },
];

export const FAQS: { q: string; a: string }[] = [
  { q: "כמה מנות ביום?", a: "מתחילים ב-2 מנות (28 גרם) ביום למשך 30 יום. אחרי שהגוף מתרגל, אפשר לשקול להגדיל ל-3 מנות (42 גרם) ביום." },
  { q: "איזה טעם יש לזה בכלל?", a: "כמעט ניטרלי. ספירולינה טרייה-קפואה לא עברה ייבוש, ולכן אין לה את הטעם החזק של האבקה. ביוגורט או בשייק — מרגישים בעיקר את הצבע." },
  { q: "הילדים יסכימו לאכול?", a: "הטריק הוא להתחיל ממתכונים שהם כבר אוהבים — שייק בננה, בודהה בול, חטיפי יוגורט קפואים. הצבע הירוק הופך ליתרון: 'שייק של הענק הירוק' עובד מצוין." },
  { q: "כמה זמן זה מחזיק במקפיא?", a: "עד 24 חודשים במקפיא ביתי. אחרי הפשרה — לצרוך באותו יום ולא להקפיא שוב." },
  { q: "אפשר לחמם את זה?", a: "לא מומלץ. חימום פוגע בחלק מהערכים התזונתיים. כל המתכונים כאן נועדו למאכלים קרים או בטמפרטורת החדר." },
  { q: "מתאים בהריון?", a: "ספירולינה נחשבת בטוחה באופן כללי, אבל כמו כל תוסף בהריון — מתייעצים עם הרופא/ה המלווה לפני שמתחילים." },
];

export const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=972545403255&text=SimpliiGood%20%D7%94%D7%99%D7%99%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%9C%20%D7%94%D7%A1%D7%A4%D7%99%D7%A8%D7%95%D7%9C%D7%99%D7%A0%D7%94%20%D7%A9%D7%9C%20";
export const SHOP_LINK = "https://simpliigood.co.il/";
export const STORE_LOCATOR_LINK = "https://simpliigood.co.il/pages/store-locator";

// רשתות חברתיות — לשיתוף ותיוג
export const INSTAGRAM_URL = "https://instagram.com/simpliigood";
export const INSTAGRAM_HANDLE = "@simpliigood";
export const SHARE_HASHTAG = "#SimpliiGood";
export const SHARE_CAPTION = "ספירולינה טרייה של @simpliigood 💚 #SimpliiGood";
