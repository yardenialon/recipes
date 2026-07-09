"use client";

import { useCallback, useEffect, useState } from "react";

interface Item {
  id: number;
  device: string;
  createdAt: string;
  path: string;
  url: string | null;
}

const TOKEN_KEY = "sg_admin_token";

export default function Admin() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async (t: string) => {
    setError("");
    const res = await fetch("/api/admin/uploads", { headers: { "x-admin-token": t } });
    if (res.status === 401) {
      setError("סיסמה שגויה");
      setAuthed(false);
      return false;
    }
    if (res.status === 503) {
      setError("הפאנל לא מוגדר (חסר ADMIN_TOKEN בשרת)");
      setAuthed(false);
      return false;
    }
    const d = await res.json();
    setItems(d?.items ?? []);
    setAuthed(true);
    return true;
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) : null;
    if (saved) {
      setToken(saved);
      load(saved);
    }
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await load(token);
    if (ok) sessionStorage.setItem(TOKEN_KEY, token);
  }

  async function moderate(item: Item, action: "approve" | "reject") {
    setBusy(item.id);
    try {
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: item.id, action, path: item.path }),
      });
      if (res.ok) setItems((prev) => (prev ? prev.filter((x) => x.id !== item.id) : prev));
      else setError("הפעולה נכשלה");
    } finally {
      setBusy(null);
    }
  }

  if (!authed) {
    return (
      <main className="max-w-md mx-auto min-h-screen px-5 py-16">
        <h1 className="text-2xl font-black">כניסת אדמין</h1>
        <p className="text-sm text-brand-soft mt-1">מודרציה של תמונות משתמשים</p>
        <form onSubmit={submit} className="mt-5">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="סיסמת אדמין"
            className="w-full rounded-btn border border-brand-line px-4 py-3 text-base"
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-3 rounded-btn py-3 font-extrabold bg-brand-green text-white"
          >
            כניסה
          </button>
        </form>
        {error && <div className="text-sm text-red-500 font-bold mt-3">{error}</div>}
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto min-h-screen px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">ממתין לאישור</h1>
        <span className="text-sm text-brand-soft">{items?.length ?? 0} פריטים</span>
      </div>
      {error && <div className="text-sm text-red-500 font-bold mt-3">{error}</div>}

      {items && items.length === 0 ? (
        <div className="text-center text-brand-soft py-20">אין תמונות שממתינות לאישור 🎉</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {items?.map((item) => (
            <div key={item.id} className="bg-white rounded-card shadow-card overflow-hidden">
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="העלאת משתמש" className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-brand-mint flex items-center justify-center text-brand-soft">
                  התמונה לא נטענה
                </div>
              )}
              <div className="p-3">
                <div className="text-xs text-brand-soft mb-2">
                  {item.device}… · {new Date(item.createdAt).toLocaleString("he-IL")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moderate(item, "approve")}
                    disabled={busy === item.id}
                    className="flex-1 rounded-btn py-2.5 font-extrabold bg-brand-green text-white disabled:opacity-50"
                  >
                    אישור ✓
                  </button>
                  <button
                    onClick={() => moderate(item, "reject")}
                    disabled={busy === item.id}
                    className="flex-1 rounded-btn py-2.5 font-extrabold bg-brand-mint text-brand-green disabled:opacity-50"
                  >
                    דחייה ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
