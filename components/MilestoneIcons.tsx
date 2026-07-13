// ============================================================
// אייקוני אבני-דרך — SVG מותאמים בשפת המותג (גרדיאנט טורקיז + מבטאי צהוב).
// לא אמוג'ים: מדליה, כרטיס-קופון, קופסת-מתנה וגביע.
// ============================================================
import type { MilestoneKind } from "@/lib/rewards";

const YELLOW = "#FEE62D";
const YELLOW_DEEP = "#F5C400";

/** גרדיאנט הטורקיז החתום של המותג — id ייחודי לכל אייקון */
function TealDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1A8A6F" />
        <stop offset="0.55" stopColor="#0E5B4A" />
        <stop offset="1" stopColor="#0A3E33" />
      </linearGradient>
    </defs>
  );
}

/** מדליית-רוזטה עם סרטים וכוכב — "תג רצינות" */
function BadgeIcon({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden>
      <TealDefs id={g} />
      {/* סרטי המדליה */}
      <path d="M17.5 29l-4.5 12.5 6-3.2 3.8 4.7 3-11z" fill={YELLOW} />
      <path d="M30.5 29l4.5 12.5-6-3.2-3.8 4.7-3-11z" fill={YELLOW_DEEP} />
      {/* מדליון */}
      <circle cx="24" cy="18.5" r="13.5" fill={`url(#${g})`} />
      <circle cx="24" cy="18.5" r="13.5" stroke={YELLOW} strokeWidth="2.2" />
      <circle cx="24" cy="18.5" r="9.4" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.4" />
      {/* כוכב */}
      <path
        d="M24 11.2l2.35 4.76 5.25.77-3.8 3.7.9 5.23L24 23.2l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77z"
        fill={YELLOW}
      />
    </svg>
  );
}

/** כרטיס-קופון עם ניקוב ו-"%" — הנחות */
function CouponIcon({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden>
      <TealDefs id={g} />
      <g transform="rotate(-9 24 24)">
        <rect x="7" y="15" width="34" height="18" rx="4.5" fill={`url(#${g})`} />
        {/* קו ניקוב */}
        <line
          x1="30"
          y1="16.5"
          x2="30"
          y2="31.5"
          stroke={YELLOW}
          strokeWidth="1.6"
          strokeDasharray="2 2.4"
          strokeLinecap="round"
        />
        {/* סימן אחוז */}
        <circle cx="17.5" cy="20.5" r="2.5" stroke={YELLOW} strokeWidth="2" />
        <circle cx="23.5" cy="27.5" r="2.5" stroke={YELLOW} strokeWidth="2" />
        <line x1="24.5" y1="19.5" x2="16.5" y2="28.5" stroke={YELLOW} strokeWidth="2.2" strokeLinecap="round" />
        {/* כוכב קטן על הספח */}
        <path
          d="M35.5 21.3l.8 1.65 1.8.26-1.3 1.27.31 1.8-1.61-.85-1.6.85.3-1.8-1.3-1.27 1.8-.26z"
          fill={YELLOW}
        />
      </g>
    </svg>
  );
}

/** קופסת-מתנה עם סרט ופפיון — מתנת הקרקרים */
function GiftIcon({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden>
      <TealDefs id={g} />
      {/* גוף הקופסה */}
      <rect x="10" y="20" width="28" height="19" rx="3" fill={`url(#${g})`} />
      {/* מכסה */}
      <rect x="8" y="15" width="32" height="7.5" rx="2.5" fill={`url(#${g})`} stroke={YELLOW} strokeOpacity="0.0" />
      <rect x="8" y="15" width="32" height="7.5" rx="2.5" fill="#0E5B4A" />
      {/* סרט אנכי */}
      <rect x="21" y="15" width="6" height="24" fill={YELLOW} />
      {/* פפיון */}
      <path d="M24 15c-1-3.2-4-5-6-3.6-2 1.4-1.1 4.3 2 5.1 1.4.36 2.8.5 4 .5z" fill={YELLOW} />
      <path d="M24 15c1-3.2 4-5 6-3.6 2 1.4 1.1 4.3-2 5.1-1.4.36-2.8.5-4 .5z" fill={YELLOW_DEEP} />
      <circle cx="24" cy="15" r="1.9" fill={YELLOW} />
    </svg>
  );
}

/** גביע ניצחון עם כוכב — פרס-העל */
function TrophyIcon({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden>
      <TealDefs id={g} />
      {/* ידיות */}
      <path d="M14 15H9.5a4.5 4.5 0 0 0 6 4.2" stroke={YELLOW} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M34 15h4.5a4.5 4.5 0 0 1-6 4.2" stroke={YELLOW} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* גביע */}
      <path d="M14 12h20v6a10 10 0 0 1-20 0z" fill={`url(#${g})`} />
      <path d="M14 12h20v6a10 10 0 0 1-20 0z" stroke={YELLOW} strokeWidth="2.2" strokeLinejoin="round" />
      {/* רגל ובסיס */}
      <rect x="22" y="27.5" width="4" height="6" fill="#0E5B4A" />
      <rect x="16" y="33" width="16" height="4" rx="1.6" fill={YELLOW} />
      {/* כוכב */}
      <path
        d="M24 14l1.5 3.05 3.36.49-2.43 2.37.57 3.35L24 25.08l-3 1.57.57-3.35-2.43-2.37 3.36-.49z"
        fill={YELLOW}
      />
      {/* נצנוצים */}
      <path d="M11 25l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z" fill={YELLOW} opacity="0.9" />
      <path d="M37 24l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" fill={YELLOW} opacity="0.9" />
    </svg>
  );
}

/**
 * אייקון אבן-דרך לפי סוג. `muted` מעמעם למצב נעול (טרם הושג).
 */
export function MilestoneIcon({ kind, muted = false }: { kind: MilestoneKind; muted?: boolean }) {
  // id ייחודי כדי שגרדיאנטים לא יתנגשו בין מופעים
  const g = `mtl-${kind}-${muted ? "m" : "a"}`;
  const inner =
    kind === "badge" ? (
      <BadgeIcon g={g} />
    ) : kind === "coupon" ? (
      <CouponIcon g={g} />
    ) : kind === "gift" ? (
      <GiftIcon g={g} />
    ) : (
      <TrophyIcon g={g} />
    );
  return (
    <span
      className={`block w-7 h-7 transition ${muted ? "opacity-45 grayscale-[0.35]" : ""}`}
      aria-hidden
    >
      {inner}
    </span>
  );
}
