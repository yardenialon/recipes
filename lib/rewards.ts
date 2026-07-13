// ============================================================
// פאזה 3 — תגמולים ותגי הישג
// נגזר מה-Progress הקיים (ימים/נקודות) — בלי טבלאות או תשתית חדשה.
// ============================================================

import type { Progress } from "./challenge";

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  daysNeeded: number;
}

/** תגי הישג לפי מספר הימים שהושלמו במסע */
export const BADGES: Badge[] = [
  { id: "start", emoji: "🌱", title: "יצאת לדרך", desc: "יום ראשון", daysNeeded: 1 },
  { id: "three", emoji: "🔥", title: "מומנטום", desc: "3 ימים", daysNeeded: 3 },
  { id: "week", emoji: "💪", title: "שבוע שלם", desc: "7 ימים", daysNeeded: 7 },
  { id: "champ", emoji: "🏆", title: "אלוף האתגר", desc: "14 ימים", daysNeeded: 14 },
];

// שכבת תגמול — קוד קופון שנפתח בהגעה לסף נקודות (10 נק' ליום הכנה).
// ⚠️ code ו-label הם placeholders — להחליף במבצע אמיתי מול SimpliiGood לפני שיווק.
export const REWARD = {
  pointsNeeded: 100, // ~10 ימי הכנה
  code: "SIMPLII10",
  label: "10% הנחה",
};

// ============================================================
// מפת אבני-דרך של האתגר — מה זוכים בכל יום-מפתח.
// מקור-אמת יחיד, מזין גם את הדף הראשי וגם את "המסע שלי".
// ⚠️ שדות `code` הם PLACEHOLDERS — להחליף בקודי קופון אמיתיים
//    מול SimpliiGood לפני שיווק.
// ============================================================

export type MilestoneKind = "badge" | "coupon" | "gift" | "grand";

export interface Milestone {
  id: string;
  day: number;
  kind: MilestoneKind;
  title: string; // שם הפרס
  detail: string; // תיאור קצר
  code?: string; // קוד קופון (placeholder)
}

export const MILESTONES: Milestone[] = [
  { id: "serious", day: 3, kind: "badge", title: "תג רצינות", detail: "3 ימים ברצף — נכנסת לקצב" },
  { id: "off10", day: 5, kind: "coupon", title: "10% הנחה", detail: "קופון לרכישה באתר", code: "SIMPLII10" },
  { id: "gift", day: 7, kind: "gift", title: "2 חבילות קרקר מתנה", detail: "שבוע שלם — המתנה עלינו", code: "SIMPLIICRACKER" },
  { id: "off20", day: 10, kind: "coupon", title: "20% הנחה", detail: "קופון משודרג", code: "SIMPLII20" },
  { id: "grand", day: 14, kind: "grand", title: "₪100 לרכישה באתר", detail: "סיימת את האתגר — כל הכבוד!", code: "SIMPLII100" },
];

export interface MilestoneStatus extends Milestone {
  earned: boolean;
}

/** מצב אבני-הדרך לפי מספר הימים שהושלמו */
export function milestoneStatus(daysCompleted: number): MilestoneStatus[] {
  return MILESTONES.map((m) => ({ ...m, earned: daysCompleted >= m.day }));
}

/** אבן-הדרך הבאה שטרם הושגה (למסרים מוטיבציוניים) */
export function nextMilestone(daysCompleted: number): Milestone | null {
  return MILESTONES.find((m) => daysCompleted < m.day) ?? null;
}

export interface EarnedBadge extends Badge {
  earned: boolean;
}

export function badgeStatus(daysCompleted: number): EarnedBadge[] {
  return BADGES.map((b) => ({ ...b, earned: daysCompleted >= b.daysNeeded }));
}

export function rewardStatus(points: number): { unlocked: boolean; remaining: number } {
  const remaining = Math.max(0, REWARD.pointsNeeded - points);
  return { unlocked: remaining === 0, remaining };
}

/** התג שנפתח *בדיוק כעת* (daysCompleted הגיע לסף) — להצגה במסך ההצלחה */
export function badgeJustEarned(progress: Progress | null): Badge | null {
  if (!progress) return null;
  return BADGES.find((b) => b.daysNeeded === progress.daysCompleted) ?? null;
}
