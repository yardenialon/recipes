import { NextRequest, NextResponse } from "next/server";
import { mapProgress, type Progress } from "@/lib/challenge";

/**
 * POST /api/upload — העלאת תמונת משתמש (multipart: deviceId + file)
 *
 * מאחסן את הקובץ ב-bucket פרטי 'ugc' (רק service role ניגש), רושם שורה
 * ב-ugc_uploads עם status='pending', ומעניק נקודות עם תקרה יומית (RPC record_upload).
 * המדיה לא מוצגת בשום מקום עד אישור (מודרציה — פאזה 4).
 */

export const dynamic = "force-dynamic";

type Env = { url: string; key: string };

const MAX_BYTES = 3 * 1024 * 1024;

function supabaseEnv(): Env | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export async function POST(req: NextRequest) {
  const env = supabaseEnv();
  if (!env) {
    return NextResponse.json({ ok: false, error: "storage unavailable" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid form" }, { status: 400 });
  }

  const deviceId = form.get("deviceId");
  const file = form.get("file");
  const nameRaw = form.get("name");
  const name = typeof nameRaw === "string" ? nameRaw.trim().slice(0, 40) : "";

  if (typeof deviceId !== "string" || deviceId.length < 8 || deviceId.length > 64) {
    return NextResponse.json({ ok: false, error: "invalid device" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "images only" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "file too large" }, { status: 413 });
  }

  const safeDevice = deviceId.replace(/[^a-zA-Z0-9_-]/g, "");
  const path = `${safeDevice}/${Date.now()}.webp`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  // 1) העלאה ל-storage
  const up = await fetch(`${env.url}/storage/v1/object/ugc/${path}`, {
    method: "POST",
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": file.type || "image/webp",
    },
    body: bytes,
  });
  if (!up.ok) {
    console.error("storage upload failed", up.status);
    return NextResponse.json({ ok: false, error: "upload failed" }, { status: 502 });
  }

  // 2) רישום + נקודות (תקרה יומית)
  let progress: Progress | null = null;
  let awarded = false;
  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/record_upload`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ p_device_id: safeDevice, p_path: path, p_name: name || null }),
    });
    if (res.ok) {
      const data = await res.json();
      const row = Array.isArray(data) ? data[0] : data;
      awarded = !!row?.awarded;
      progress = mapProgress(row);
    } else {
      console.error("record_upload rpc failed", res.status);
    }
  } catch {
    // המדיה כבר נשמרה; אם ה-RPC נפל פשוט לא מעדכנים נקודות
  }

  return NextResponse.json({ ok: true, awarded, progress });
}
