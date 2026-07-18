"use client";

import { useState } from "react";
import { milestoneStatus, nextMilestone, type MilestoneStatus } from "@/lib/rewards";
import { MilestoneIcon } from "./MilestoneIcons";

/** כפתור העתקת קוד קופון (מוצג רק כשאבן-הדרך הושגה, במצב "live") */
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code).catch(() => {});
        setCopied(true);
      }}
      className="mt-2 inline-flex items-center gap-1.5 bg-brand-green text-brand-yellow font-black text-[12px] rounded-full px-3 py-1 tracking-[0.12em]"
    >
      {code} <span aria-hidden>{copied ? "✓" : "📋"}</span>
    </button>
  );
}

function Row({
  m,
  isLast,
  nextEarned,
  live,
  daysLeft,
}: {
  m: MilestoneStatus;
  isLast: boolean;
  nextEarned: boolean;
  live: boolean;
  daysLeft: number;
}) {
  return (
    <li className="relative flex gap-3.5 pb-5 last:pb-0">
      {/* קו מחבר אנכי (מתמלא ירוק עד ההתקדמות) */}
      {!isLast && (
        <span
          className={`absolute top-11 bottom-0 w-[3px] rounded-full ${
            nextEarned ? "bg-brand-green" : "bg-brand-line"
          }`}
          style={{ right: "20.5px" }}
          aria-hidden
        />
      )}

      {/* צומת האייקון — במצב preview הכל תוסס (תצוגת פרסים); ב-live נעול מעומעם */}
      <div
        className={`relative z-10 grid place-items-center w-11 h-11 rounded-full shrink-0 ${
          m.earned || !live
            ? "bg-brand-mint ring-2 ring-brand-green shadow-card"
            : "bg-brand-mint/45 ring-1 ring-brand-line"
        }`}
      >
        <MilestoneIcon kind={m.kind} muted={live && !m.earned} />
        {m.earned && (
          <span className="absolute -top-1 -left-1 w-[18px] h-[18px] rounded-full bg-brand-green text-brand-yellow text-[10px] grid place-items-center ring-2 ring-white">
            ✓
          </span>
        )}
      </div>

      {/* תוכן */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-black rounded-full px-2 py-0.5 ${
              m.earned ? "bg-brand-green text-brand-yellow" : "bg-brand-mint text-brand-green"
            }`}
          >
            יום {m.day}
          </span>
          {live && !m.earned && daysLeft > 0 && (
            <span className="text-[10.5px] text-brand-soft font-bold inline-flex items-center gap-1">
              <span aria-hidden>🔒</span> עוד {daysLeft} {daysLeft === 1 ? "יום" : "ימים"}
            </span>
          )}
        </div>
        <div className="font-extrabold text-[14.5px] leading-tight mt-1 text-brand-green">
          {m.title}
        </div>
        <div className="text-[12px] text-brand-soft mt-0.5 leading-snug">{m.detail}</div>
        {live && m.earned && m.code && <CopyCode code={m.code} />}
      </div>
    </li>
  );
}

/**
 * מפת הפרסים של האתגר — אינפוגרפיקה של אבני-דרך.
 * variant="preview" (דף הבית) מציג "מה אפשר לזכות".
 * variant="live" (המסע שלי) משקף התקדמות אמיתית וחושף קודים שנפתחו.
 */
export default function RewardsRoadmap({
  days = 0,
  variant = "preview",
}: {
  days?: number;
  variant?: "preview" | "live";
}) {
  const items = milestoneStatus(days);
  const live = variant === "live";

  // נאדג' "הפרס הבא" — כמה ימים נותרו לאבן-הדרך הבאה שטרם הושגה
  const next = live ? nextMilestone(days) : null;
  const daysToNext = next ? next.day - days : 0;

  return (
    <div className="bg-white rounded-card shadow-card border border-brand-line/70 p-5">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-xl" aria-hidden>🎁</span>
        <h3 className="text-lg font-black text-brand-green">מה זוכים באתגר</h3>
      </div>
      {live && next ? (
        <div className="mb-4 bg-brand-mint rounded-btn px-3.5 py-2 flex items-center gap-2">
          <span className="text-base" aria-hidden>🔥</span>
          <span className="text-[13px] font-bold text-brand-green">
            {daysToNext === 1 ? "עוד יום אחד" : `עוד ${daysToNext} ימים`} ל{next.title}
          </span>
        </div>
      ) : (
        <p className="text-[12.5px] text-brand-soft mb-4 leading-snug">
          {live
            ? "סיימת את כל אבני-הדרך — כל הכבוד! 🏆"
            : "כל יום של מנה ירוקה מקרב אתכם לפרס — עד ₪100 מתנה."}
        </p>
      )}

      <ol className="relative">
        {items.map((m, i) => (
          <Row
            key={m.id}
            m={m}
            isLast={i === items.length - 1}
            nextEarned={i < items.length - 1 && items[i + 1].earned}
            live={live}
            daysLeft={Math.max(0, m.day - days)}
          />
        ))}
      </ol>

      {!live && (
        <p className="text-[11.5px] text-brand-soft text-center mt-1.5">
          מתחילים היום — הרצף שומר לכם את הפרסים 🌱
        </p>
      )}
    </div>
  );
}
