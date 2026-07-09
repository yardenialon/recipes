import { NextResponse } from "next/server";
import { supabaseEnv, signUrl } from "@/lib/supabaseServer";

/**
 * GET /api/feed — הפיד הציבורי: תמונות משתמשים שאושרו (URL חתום זמני).
 * בלי env (או בשגיאה) — מחזיר רשימה ריקה, כדי שהעמוד ירוץ תמיד.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const env = supabaseEnv();

  // אבחון זמני: /api/feed?diag=1 — מדוע הפיד ריק (בלי סודות)
  if (new URL(req.url).searchParams.get("diag") === "1") {
    const diag: Record<string, unknown> = {
      hasEnv: !!env,
      approvedCount: null,
      feedSelectStatus: null,
      feedSelectError: null,
      signOk: null,
    };
    if (env) {
      const h = { apikey: env.key, Authorization: `Bearer ${env.key}`, Accept: "application/json" };
      try {
        const c = await fetch(
          `${env.url}/rest/v1/ugc_uploads?select=id&status=eq.approved`,
          { headers: { ...h, Prefer: "count=exact", Range: "0-0" } }
        );
        const cr = c.headers.get("content-range");
        diag.approvedCount = cr ? parseInt(cr.split("/")[1] ?? "0", 10) : null;
      } catch (e) {
        diag.feedSelectError = String(e).slice(0, 200);
      }
      const sel = await fetch(
        `${env.url}/rest/v1/ugc_uploads?select=id,storage_path,created_at,display_name&status=eq.approved&order=created_at.desc&limit=1`,
        { headers: h }
      );
      diag.feedSelectStatus = sel.status;
      if (!sel.ok) diag.feedSelectError = (await sel.text()).slice(0, 300);
      else {
        const rows = await sel.json();
        if (Array.isArray(rows) && rows[0]?.storage_path) {
          diag.signOk = !!(await signUrl(env, rows[0].storage_path));
        }
      }
    }
    return NextResponse.json(diag);
  }

  if (!env) return NextResponse.json({ ok: true, items: [] });

  try {
    const res = await fetch(
      `${env.url}/rest/v1/ugc_uploads?select=id,storage_path,created_at,display_name&status=eq.approved&order=created_at.desc&limit=30`,
      { headers: { apikey: env.key, Authorization: `Bearer ${env.key}`, Accept: "application/json" } }
    );
    if (!res.ok) return NextResponse.json({ ok: true, items: [] });

    const rows = (await res.json()) as Array<{
      id: number;
      storage_path: string;
      created_at: string;
      display_name: string | null;
    }>;
    const signed = await Promise.all(
      rows.map(async (r) => {
        const url = await signUrl(env, r.storage_path);
        return url ? { id: r.id, url, createdAt: r.created_at, name: r.display_name ?? null } : null;
      })
    );
    return NextResponse.json({ ok: true, items: signed.filter(Boolean) });
  } catch {
    return NextResponse.json({ ok: true, items: [] });
  }
}
