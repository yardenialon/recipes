import { NextRequest, NextResponse } from "next/server";
import { EMPTY_PROGRESS, mapProgress } from "@/lib/challenge";

/**
 * GET /api/progress?device=… — מחזיר את מצב מסע ה-14 יום למכשיר.
 * בלי env של Supabase (או בשגיאה) — מחזיר progress ריק, כדי שהמסך ירוץ תמיד.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const device = req.nextUrl.searchParams.get("device");
  if (!device || device.length < 8 || device.length > 64) {
    return NextResponse.json({ ok: false, error: "invalid device" }, { status: 400 });
  }

  if (!url || !key) return NextResponse.json({ ok: true, progress: EMPTY_PROGRESS });

  try {
    const res = await fetch(
      `${url}/rest/v1/challenge_progress?select=*&device_id=eq.${encodeURIComponent(device)}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return NextResponse.json({ ok: true, progress: EMPTY_PROGRESS });
    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    return NextResponse.json({ ok: true, progress: row ? mapProgress(row) : EMPTY_PROGRESS });
  } catch {
    return NextResponse.json({ ok: true, progress: EMPTY_PROGRESS });
  }
}
