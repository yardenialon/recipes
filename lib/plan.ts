// ============================================================
// מסלול 14 הימים — היום → המתכון של אותו יום.
// מקור-אמת יחיד שמחבר את הודעות ה-WhatsApp, הדף הראשי ומסך המסע:
// כל יום מצביע על מתכון אמיתי מ-lib/recipes (אותו slug שנפתח ב-deep link).
// ============================================================
import { CHALLENGE_DAYS } from "./challenge";
import { RECIPES, type Recipe } from "./recipes";

export interface PlanDay {
  day: number;
  slug: string;
}

/** רצף המתכונים לאורך האתגר — תואם לנוסח הודעות ה-WhatsApp */
export const CHALLENGE_PLAN: PlanDay[] = [
  { day: 1, slug: "green-yogurt" }, // יוגורט ירוק — הכי קל להתחיל
  { day: 2, slug: "orange-spirulina" }, // מיץ תפוזים ירוק
  { day: 3, slug: "protein-banana-shake" }, // שייק חלבון בננה
  { day: 4, slug: "avocado-spirulina" }, // ספירולינה אבוקדו
  { day: 5, slug: "green-hummus" }, // חומוס ירוק
  { day: 6, slug: "buddha-bowl" }, // בודהה בול — יום אינסטגרם
  { day: 7, slug: "fresh-tahini" }, // טחינה ירוקה — שבוע שלם
  { day: 8, slug: "tuna-spirulina" }, // סלט טונה
  { day: 9, slug: "salad-dressing" }, // רוטב סלט ירוק
  { day: 10, slug: "chia-pudding" }, // פודינג צ'יה — מכינים מהערב
  { day: 11, slug: "green-pesto" }, // פסטו ספירולינה
  { day: 12, slug: "yogurt-bark" }, // חטיפי יוגורט קפואים
  { day: 13, slug: "protein-yogurt-pro" }, // יוגורט פרו — המנצח
  { day: 14, slug: "tropical-green-shake" }, // שייק טרופי — סיום חגיגי
];

/** המתכון של יום מסוים במסלול (null אם אין) */
export function recipeForDay(day: number): Recipe | null {
  const entry = CHALLENGE_PLAN.find((p) => p.day === day);
  if (!entry) return null;
  return RECIPES.find((r) => r.slug === entry.slug) ?? null;
}

/**
 * היום הפעיל במסלול לפי ההתקדמות — היום הבא שצריך להכין.
 * daysCompleted=0 → יום 1; daysCompleted=6 → יום 7; מוגבל ל-14.
 */
export function currentPlanDay(daysCompleted: number): number {
  return Math.min(Math.max(daysCompleted, 0) + 1, CHALLENGE_DAYS);
}
