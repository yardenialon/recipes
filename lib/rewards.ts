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
