import { NextRequest, NextResponse } from "next/server";
import { EMPTY_PROGRESS, mapProgress } from "@/lib/challenge";

/**
 * GET /api/progress?device=… — מחזיר את מצב מסע ה-14 יום למכשיר.
 * GET /api/progress?diag=1    — אבחון זמני: השורות האחרונות בטבלה (בלי PII).
 * no-store — לעולם לא מגישים מה-cache, אחרת המסך "נתקע" על ערך ישן.
 */

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = url && key ? { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" } : null;

  // ---- אבחון זמני ----
  if (req.nextUrl.searchParams.get("diag") === "1") {
    if (!headers || !url) return json({ hasEnv: false });
    try {
      const res = await fetch(
        `${url}/rest/v1/challenge_progress?select=device_id,days_completed,current_streak,longest_streak,points,started_at,last_day,last_upload_day,updated_at&order=updated_at.desc&limit=10`,
        { headers }
      );
      const rows = res.ok ? await res.json() : [];
      const safe = Array.isArray(rows)
        ? rows.map((r) => ({ ...r, device_id: String(r.device_id).slice(0, 10) + "…" }))
        : [];
      return json({ hasEnv: true, status: res.status, count: safe.length, rows: safe });
    } catch (e) {
      return json({ hasEnv: true, error: String(e).slice(0, 200) });
    }
  }

  const device = req.nextUrl.searchParams.get("device");
  if (!device || device.length < 8 || device.length > 64) {
    return json({ ok: false, error: "invalid device" }, 400);
  }

  if (!headers || !url) return json({ ok: true, progress: EMPTY_PROGRESS });

  try {
    const res = await fetch(
      `${url}/rest/v1/challenge_progress?select=*&device_id=eq.${encodeURIComponent(device)}`,
      { headers }
    );
    if (!res.ok) return json({ ok: true, progress: EMPTY_PROGRESS });
    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    return json({ ok: true, progress: row ? mapProgress(row) : EMPTY_PROGRESS });
  } catch {
    return json({ ok: true, progress: EMPTY_PROGRESS });
  }
}
