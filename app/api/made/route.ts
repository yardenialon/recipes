import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/made — רישום "הכנתי!" אנונימי
 *
 * פאזה 1: אם מוגדרים משתני סביבה של Supabase — נכתב לטבלת recipe_completions.
 * אם לא — no-op שקט (המונה בצד לקוח עדיין עולה). כך הפרויקט נפרס גם בלי Supabase ביום הראשון.
 * הסכימה: supabase/schema.sql
 */
export async function POST(req: NextRequest) {
  let slug: unknown;
  try {
    ({ slug } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (typeof slug !== "string" || slug.length > 64) {
    return NextResponse.json({ ok: false, error: "invalid slug" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/recipe_completions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
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
