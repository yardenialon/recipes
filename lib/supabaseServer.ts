// ============================================================
// עזרי צד-שרת ל-Supabase (משמשים רק ב-route handlers, לא בלקוח).
// אין לייבא מקומפוננטות לקוח — משתמשים ב-service role key.
// ============================================================

export type Env = { url: string; key: string };

export function supabaseEnv(): Env | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

/** יוצר URL חתום זמני לצפייה בקובץ ב-bucket הפרטי 'ugc'. null בכשל. */
export async function signUrl(env: Env, path: string, expiresIn = 3600): Promise<string | null> {
  try {
    const res = await fetch(`${env.url}/storage/v1/object/sign/ugc/${path}`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d?.signedURL ? `${env.url}/storage/v1${d.signedURL}` : null;
  } catch {
    return null;
  }
}
