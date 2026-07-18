import { NextResponse } from "next/server";
import { supabaseEnv } from "@/lib/supabaseServer";

/**
 * GET /api/stats — נתוני הוכחה חברתית (אמיתיים, מצטברים):
 *   participants — כמה יצאו לאתגר (שורות ב-challenge_progress)
 *   made         — כמה מנות סומנו "הכנתי!" בסך הכל (recipe_completions)
 *
 * בלי env של Supabase → אפסים (הרכיב בלקוח פשוט לא יוצג).
 * גישה צד-שרת בלבד עם ה-service role key.
 */

export const dynamic = "force-dynamic";

async function countRows(env: { url: string; key: string }, table: string, select: string): Promise<number> {
  try {
    const res = await fetch(`${env.url}/rest/v1/${table}?select=${select}`, {
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    });
    const cr = res.headers.get("content-range"); // "0-0/42" או "*/0"
    const total = cr ? parseInt(cr.split("/")[1] ?? "0", 10) : 0;
    return Number.isNaN(total) ? 0 : total;
  } catch {
    return 0;
  }
}

export async function GET() {
  const env = supabaseEnv();
  if (!env) {
    return NextResponse.json({ ok: true, participants: 0, made: 0 }, { headers: { "Cache-Control": "no-store" } });
  }

  const [participants, made] = await Promise.all([
    countRows(env, "challenge_progress", "device_id"),
    countRows(env, "recipe_completions", "id"),
  ]);

  return NextResponse.json(
    { ok: true, participants, made },
    { headers: { "Cache-Control": "no-store" } }
  );
}
