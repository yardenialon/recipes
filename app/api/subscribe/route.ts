import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscribe — רישום לתזכורות וואטסאפ יומיות דרך Flashy.
 * גוף: { phone, name?, consent:true }
 *
 * דורש הסכמה מפורשת (consent). מנרמל טלפון ישראלי ל-E.164 ודוחף איש קשר
 * לרשימה ב-Flashy (אוטומציית 14 יום מופעלת שם על הצטרפות לרשימה).
 * הטלפון נשמר רק ב-Flashy — לא אצלנו.
 *
 * קונפיג (משתני סביבה, לא בקוד):
 *   FLASHY_API_KEY  — מפתח ה-API (סודי)
 *   FLASHY_LIST     — שם/מזהה הרשימה (ברירת מחדל: challenge-14)
 *   FLASHY_API_URL  — override ל-endpoint אם צריך
 */

export const dynamic = "force-dynamic";

const DEFAULT_URL = "https://api.flashy.app/contact?overwrite=true";

function config() {
  return {
    key: process.env.FLASHY_API_KEY,
    list: process.env.FLASHY_LIST || "challenge-14",
    url: process.env.FLASHY_API_URL || DEFAULT_URL,
  };
}

/** מנרמל טלפון ישראלי ל-E.164 (9725XXXXXXXX). "" אם לא תקין. */
function normalizeIL(raw: unknown): string {
  const d = String(raw ?? "").replace(/\D/g, "");
  let e = d;
  if (e.startsWith("972")) e = e;
  else if (e.startsWith("0")) e = "972" + e.slice(1);
  else if (e.length === 9) e = "972" + e; // ללא אפס מוביל
  // מובייל ישראלי: 972 + 5X + 7 ספרות = 12 ספרות
  return /^9725\d{8}$/.test(e) ? e : "";
}

export async function GET() {
  // אבחון תצורה (בלי סודות)
  const c = config();
  return NextResponse.json({ hasKey: !!c.key, list: c.list, apiUrl: c.url });
}

export async function POST(req: NextRequest) {
  let body: { phone?: unknown; name?: unknown; consent?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  if (body?.consent !== true) {
    return NextResponse.json({ ok: false, error: "consent required" }, { status: 400 });
  }

  const phone = normalizeIL(body?.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "invalid phone" }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";

  const c = config();
  if (!c.key) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  let upstreamStatus = 0;
  try {
    const res = await fetch(c.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": c.key,
      },
      body: JSON.stringify({
        primary_key: "phone",
        contact: {
          phone,
          first_name: name || undefined,
          lists: { [c.list]: 1 },
        },
      }),
    });
    upstreamStatus = res.status;
    const upstreamBody = (await res.text()).slice(0, 400);
    if (!res.ok) {
      console.error("flashy subscribe failed", res.status, upstreamBody);
      return NextResponse.json(
        { ok: false, error: "subscribe failed", upstreamStatus, upstreamBody },
        { status: 502 }
      );
    }
    // חלק מה-APIים מחזירים 200 עם שגיאה בגוף — נחשוף גם את זה לאבחון
    return NextResponse.json({ ok: true, upstreamStatus, upstreamBody });
  } catch (e) {
    console.error("flashy request error", String(e).slice(0, 200));
    return NextResponse.json(
      { ok: false, error: "network", detail: String(e).slice(0, 200) },
      { status: 502 }
    );
  }
}
