import { NextRequest, NextResponse } from "next/server";
import { RECIPES } from "@/lib/recipes";
import { mapProgress, type Progress } from "@/lib/challenge";

/**
 * /api/made — מונה "הכנתי!" + אתגר 14 יום
 *
 * POST { slug, deviceId? } — רושם הכנה (recipe_completions); אם נשלח deviceId
 *   תקין, מעדכן גם את מסע ה-14 יום (RPC record_challenge_day) ומחזיר progress.
 * GET  ?slug=…             — כמה הכינו את המתכון ב-7 הימים האחרונים ("השבוע").
 *
 * בלי env של Supabase — no-op שקט (count=0, progress=null), כדי שהאתר ירוץ גם בלי DB.
 * כל הגישה ל-DB היא צד-שרת בלבד עם ה-service role key — לעולם לא נחשף ללקוח.
 */

export const dynamic = "force-dynamic"; // ספירות תמיד טריות, בלי cache

type Env = { url: string; key: string };

const VALID_SLUGS = new Set(RECIPES.map((r) => r.slug));
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function supabaseEnv(): Env | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function validDevice(v: unknown): v is string {
  return typeof v === "string" && v.length >= 8 && v.length <= 64;
}

async function recordChallengeDay(env: Env, deviceId: string): Promise<Progress | null> {
  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/record_challenge_day`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ p_device_id: deviceId }),
    });
    if (!res.ok) {
      console.error("challenge rpc failed", res.status);
      return null;
    }
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return row ? mapProgress(row) : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: { slug?: unknown; deviceId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const slug = body?.slug;
  if (typeof slug !== "string" || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ ok: false, error: "invalid slug" }, { status: 400 });
  }

  const env = supabaseEnv();
  let progress: Progress | null = null;

  if (env) {
    // 1) רישום ההכנה
    const res = await fetch(`${env.url}/rest/v1/recipe_completions`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ recipe_slug: slug }),
    });
    if (!res.ok) {
      // לא מפילים את חוויית המשתמש בגלל DB — מתעדים וממשיכים
      console.error("supabase insert failed", res.status);
    }

    // 2) עדכון מסע ה-14 יום (רק אם נשלח מזהה מכשיר תקין)
    if (validDevice(body?.deviceId)) {
      progress = await recordChallengeDay(env, body.deviceId);
    }
  }

  return NextResponse.json({ ok: true, progress });
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ ok: false, error: "invalid slug" }, { status: 400 });
  }

  const env = supabaseEnv();
  if (!env) return NextResponse.json({ ok: true, count: 0 });

  const since = new Date(Date.now() - WEEK_MS).toISOString();
  const query =
    `${env.url}/rest/v1/recipe_completions` +
    `?select=id&recipe_slug=eq.${encodeURIComponent(slug)}` +
    `&created_at=gte.${encodeURIComponent(since)}`;

  let count = 0;
  try {
    const res = await fetch(query, {
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        Prefer: "count=exact", // הסך הכולל חוזר בכותרת Content-Range
        Range: "0-0",
      },
    });
    const cr = res.headers.get("content-range"); // "0-0/42" או "*/0"
    if (cr) {
      const total = parseInt(cr.split("/")[1] ?? "0", 10);
      if (!Number.isNaN(total)) count = total;
    }
  } catch {
    count = 0;
  }

  return NextResponse.json({ ok: true, count });
}
