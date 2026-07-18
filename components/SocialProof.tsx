"use client";

import { useEffect, useState } from "react";

// לא מציגים הוכחה חברתית חלשה — מופיע רק כשיש מספיק משתתפים אמיתיים
const MIN_PARTICIPANTS = 10;

function fmt(n: number) {
  return n.toLocaleString("he-IL");
}

/**
 * פס הוכחה חברתית — נתונים אמיתיים ומצטברים מ-/api/stats.
 * לא מוצג כלל עד שיש מסה קריטית (MIN_PARTICIPANTS), כדי לא להראות חלש.
 */
export default function SocialProof({ className = "" }: { className?: string }) {
  const [data, setData] = useState<{ participants: number; made: number } | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (live && j?.ok) setData({ participants: j.participants ?? 0, made: j.made ?? 0 });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (!data || data.participants < MIN_PARTICIPANTS) return null;

  return (
    <div
      className={`bg-white rounded-card shadow-card border border-brand-line/70 px-5 py-3.5 flex items-center justify-center gap-6 ${className}`}
    >
      <div className="text-center">
        <div className="text-xl font-black text-brand-green leading-none">
          {fmt(data.made)}
        </div>
        <div className="text-[11px] text-brand-soft font-medium mt-1">מנות ירוקות הוכנו 🌿</div>
      </div>
      <span className="w-px h-9 bg-brand-line" aria-hidden />
      <div className="text-center">
        <div className="text-xl font-black text-brand-green leading-none">
          {fmt(data.participants)}
        </div>
        <div className="text-[11px] text-brand-soft font-medium mt-1">כבר באתגר 💚</div>
      </div>
    </div>
  );
}
