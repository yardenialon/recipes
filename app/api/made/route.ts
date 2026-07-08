import { NextRequest, NextResponse } from "next/server";
import { RECIPES } from "@/lib/recipes";

/**
 * /api/made — מונה "הכנתי!" אנונימי
 *
 * POST { slug }  — רושם הכנה חדשה (שורה בטבלת recipe_completions).
 * GET  ?slug=…   — מחזיר כמה הכינו את המתכון ב-7 הימים האחרונים ("השבוע").
 *
 * פאזה 1: אם מוגדרים משתני הסביבה של Supabase — עובד מול ה-DB.
 * אם לא — no-op שקט (POST מחזיר ok, GET מחזיר count=0), כדי שהאתר
 * ייפרס וירוץ גם בלי Supabase. הסכימה: supabase/schema.sql
 *
 * כל הגישה ל-DB היא צד-שרת בלבד עם ה-service role key — המפתח הסודי
 * לעולם לא נחשף ללקוח.
 */

export const dynamic = "force-dynamic"; // ספירות תמיד טריות, בלי cache

const VALID_SLUGS = new Set(RECIPES.map((r) => r.slug));
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export async function POST(req: NextRequest) {
  let slug: unknown;
  try {
    ({ slug } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (typeof slug !== "string" || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ ok: false, error: "invalid slug" }, { status: 400 });
  }

  const env = supabaseEnv();
  if (env) {
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
      // לא מפילים את חוויית המשתמש בגלל DB — מתעדים ולוקחים הלאה
      console.error("supabase insert failed", res.status);
    }
  }

  return NextResponse.json({ ok: true });
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
        Prefer: "count=exact", // מחזיר את הסך הכולל בכותרת Content-Range
        Range: "0-0", // לא צריך את השורות עצמן, רק את הספירה
      },
    });
    // Content-Range נראה כך: "0-0/42" (יש שורות) או "*/0" (אין)
    const cr = res.headers.get("content-range");
    if (cr) {
      const total = parseInt(cr.split("/")[1] ?? "0", 10);
      if (!Number.isNaN(total)) count = total;
    }
  } catch {
    // רשת/DB נפל — מחזירים 0 והלקוח נופל חזרה ל-baseMadeCount
    count = 0;
  }

  return NextResponse.json({ ok: true, count });
}
