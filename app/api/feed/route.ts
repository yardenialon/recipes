import { NextResponse } from "next/server";
import { supabaseEnv, signUrl } from "@/lib/supabaseServer";

/**
 * GET /api/feed — הפיד הציבורי: תמונות משתמשים שאושרו (URL חתום זמני).
 * בלי env (או בשגיאה) — מחזיר רשימה ריקה, כדי שהעמוד ירוץ תמיד.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const env = supabaseEnv();
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
