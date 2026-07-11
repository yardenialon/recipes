// ============================================================
// פאזה 2 — אתגר 14 יום אישי (אנונימי, לפי מכשיר)
// ============================================================

export const CHALLENGE_DAYS = 14;
export const POINTS_PER_MADE = 10;

export interface Progress {
  daysCompleted: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  startedAt: string | null;
  lastDay: string | null;
}

export const EMPTY_PROGRESS: Progress = {
  daysCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0,
  startedAt: null,
  lastDay: null,
};

const DEVICE_KEY = "sg_device";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

function persist(id: string) {
  try {
    localStorage.setItem(DEVICE_KEY, id);
  } catch {
    /* noop */
  }
  try {
    // גיבוי ב-cookie (שנתיים) — שורד גם אם localStorage נמחק, ולהפך
    document.cookie = `${DEVICE_KEY}=${id}; max-age=63072000; path=/; SameSite=Lax`;
  } catch {
    /* noop */
  }
}

/**
 * מזהה אנונימי יציב למכשיר. נשמר גם ב-localStorage וגם ב-cookie כדי לצמצם
 * פיצול זהות באותו דפדפן. "" בצד שרת. (חוצה-מכשירים דורש התחברות/טלפון.)
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id || id.length < 8) id = readCookie(DEVICE_KEY);
    if (!id || id.length < 8) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
    }
    persist(id); // מסנכרן את שני האחסונים
    return id;
  } catch {
    return "";
  }
}

/** שורת DB גולמית (snake_case) כפי שמגיעה מ-PostgREST */
export interface ProgressRow {
  days_completed?: number;
  current_streak?: number;
  longest_streak?: number;
  points?: number;
  started_at?: string | null;
  last_day?: string | null;
}

/** ממפה שורת DB לטיפוס Progress (משמש גם בשרת וגם בלקוח) */
export function mapProgress(row: ProgressRow | null | undefined): Progress {
  return {
    daysCompleted: Number(row?.days_completed ?? 0),
    currentStreak: Number(row?.current_streak ?? 0),
    longestStreak: Number(row?.longest_streak ?? 0),
    points: Number(row?.points ?? 0),
    startedAt: row?.started_at ?? null,
    lastDay: row?.last_day ?? null,
  };
}
