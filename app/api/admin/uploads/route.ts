import { NextRequest, NextResponse } from "next/server";
import { supabaseEnv, signUrl } from "@/lib/supabaseServer";

/**
 * /api/admin/uploads — מודרציה של העלאות משתמשים (מוגן ב-ADMIN_TOKEN).
 *
 * GET  — רשימת ההעלאות הממתינות (עם URL חתום זמני לצפייה).
 * POST { id, action: 'approve'|'reject', path? } — אישור/דחייה; בדחייה גם מוחקים את הקובץ.
 *
 * אימות: כותרת x-admin-token מול משתנה הסביבה ADMIN_TOKEN.
 * בלי ADMIN_TOKEN מוגדר — הפאנל מושבת (503).
 */

export const dynamic = "force-dynamic";

type AdminState = "ok" | "unauthorized" | "disabled";

function adminState(req: NextRequest): AdminState {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return "disabled";
  const provided = req.headers.get("x-admin-token") ?? "";
  return provided.length > 0 && provided === token ? "ok" : "unauthorized";
}

function gate(req: NextRequest): NextResponse | null {
  const st = adminState(req);
  if (st === "disabled")
    return NextResponse.json({ ok: false, error: "admin not configured" }, { status: 503 });
  if (st !== "ok") return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: NextRequest) {
  const blocked = gate(req);
  if (blocked) return blocked;

  const env = supabaseEnv();
  if (!env) return NextResponse.json({ ok: false, error: "storage unavailable" }, { status: 503 });

  const res = await fetch(
    `${env.url}/rest/v1/ugc_uploads?select=id,device_id,storage_path,created_at,display_name&status=eq.pending&order=created_at.asc&limit=50`,
    { headers: { apikey: env.key, Authorization: `Bearer ${env.key}`, Accept: "application/json" } }
  );
  if (!res.ok) return NextResponse.json({ ok: false, error: "read failed" }, { status: 502 });

  const rows = (await res.json()) as Array<{
    id: number;
    device_id: string;
    storage_path: string;
    created_at: string;
    display_name: string | null;
  }>;

  const items = await Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      device: String(r.device_id).slice(0, 8),
      name: r.display_name ?? null,
      createdAt: r.created_at,
      path: r.storage_path,
      url: await signUrl(env, r.storage_path),
    }))
  );

  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const blocked = gate(req);
  if (blocked) return blocked;

  const env = supabaseEnv();
  if (!env) return NextResponse.json({ ok: false, error: "storage unavailable" }, { status: 503 });

  let body: { id?: unknown; action?: unknown; path?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const id = body?.id;
  const action = body?.action;
  if (typeof id !== "number" || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }

  const status = action === "approve" ? "approved" : "rejected";
  const res = await fetch(`${env.url}/rest/v1/ugc_uploads?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: "update failed" }, { status: 502 });

  // בדחייה — מוחקים את הקובץ מה-storage (best-effort), אין טעם לשמור תוכן שנדחה
  if (action === "reject" && typeof body?.path === "string") {
    await fetch(`${env.url}/storage/v1/object/ugc/${body.path}`, {
      method: "DELETE",
      headers: { apikey: env.key, Authorization: `Bearer ${env.key}` },
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
