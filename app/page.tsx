import Link from "next/link";
import RecipeExplorer from "@/components/RecipeExplorer";
import Faq from "@/components/Faq";
import { RECIPES, WHATSAPP_LINK, SHOP_LINK, STORE_LOCATOR_LINK } from "@/lib/recipes";

/** Schema.org Recipe markup — נכס ה-SEO המרכזי של פאזה 1 */
function recipeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": RECIPES.map((r) => ({
      "@type": "Recipe",
      name: r.name,
      recipeIngredient: r.ingredients,
      recipeInstructions: r.steps.map((s) => ({ "@type": "HowToStep", text: s })),
      recipeCategory: r.meal,
      keywords: ["ספירולינה", ...r.tags].join(", "),
      inLanguage: "he",
    })),
  };
}

/* ===== אייקוני SVG מותאמים למותג (במקום אמוג'ים) ===== */
const cubeGrad = (id: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#147a63" />
    <stop offset="0.6" stopColor="#0E5B4A" />
    <stop offset="1" stopColor="#0A4237" />
  </linearGradient>
);

function IconThaw() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" aria-hidden>
      <defs>{cubeGrad("thawG")}</defs>
      <rect x="6" y="12" width="27" height="19" rx="6" fill="url(#thawG)" />
      <path d="M12 18c2-1.9 4.2-2.6 6.6-2.6" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 40c1.9 0 3.2-1.4 3.2-3.1 0-1.7-2.3-3.9-3.2-5-.9 1.1-3.2 3.3-3.2 5 0 1.7 1.3 3.1 3.2 3.1z" fill="#7FC6B0" />
      <circle cx="34" cy="34" r="9.5" fill="#FEE62D" />
      <path d="M34 29.2V34l3.2 2.1" stroke="#154048" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTwoCubes() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" aria-hidden>
      <defs>{cubeGrad("twoG")}</defs>
      {/* שתי מנות מלבניות (בול הקפוא) */}
      <rect x="4" y="24" width="25" height="15" rx="5" fill="url(#twoG)" />
      <rect x="20" y="10" width="25" height="15" rx="5" fill="url(#twoG)" stroke="#EAF3EF" strokeWidth="2" />
      <path d="M9 29.5c2-1.4 4.2-1.9 6.7-1.9" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 15.5c2-1.4 4.2-1.9 6.7-1.9" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCold() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" aria-hidden>
      <g stroke="#0E5B4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 7v34" />
        <path d="M9.3 15.5 38.7 32.5" />
        <path d="M38.7 15.5 9.3 32.5" />
        <path d="M24 13.5l-3.4-2.6M24 13.5l3.4-2.6" />
        <path d="M24 34.5l-3.4 2.6M24 34.5l3.4 2.6" />
        <path d="M13.7 20.6l-4.2-.2M13.7 20.6l-1-4.1" />
        <path d="M34.3 27.4l4.2.2M34.3 27.4l1 4.1" />
        <path d="M34.3 20.6l1-4.1M34.3 20.6l4.2-.2" />
        <path d="M13.7 27.4l-1 4.1M13.7 27.4l-4.2.2" />
      </g>
      <circle cx="24" cy="24" r="3.3" fill="#FEE62D" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd()) }}
      />

      {/* ===== HERO ===== */}
      <header className="bg-brand-green text-white px-5 pt-7 pb-9 relative overflow-hidden md:rounded-b-[32px]">
        <span className="cube cube-lg absolute left-5 top-6 rotate-[-12deg] opacity-95" aria-hidden />
        <span
          className="cube absolute left-16 top-20 rotate-[18deg] opacity-85"
          style={{ width: 34, height: 34, borderRadius: 10 }}
          aria-hidden
        />
        <div className="text-xs font-extrabold text-brand-yellow tracking-wide mb-4">
          SIMPLIIGOOD
        </div>
        <h1 className="text-[31px] md:text-[44px] font-black leading-[1.15]">
          2 מנות ביום.
          <br />
          <span className="text-brand-yellow">ככה פשוט.</span>
        </h1>
        <p className="text-sm md:text-base text-[#BFD4D2] mt-2.5 max-w-md">
          כל הדרכים לשלב ספירולינה טרייה ביומיום — בלי להיות שף ובלי לשנות הרגלים.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#recipes"
            className="inline-block bg-brand-yellow text-brand-green font-extrabold rounded-btn px-8 py-3.5 shadow-btn transition-transform active:scale-[0.97]"
          >
            גלו איך מתחילים ↓
          </a>
          <Link
            href="/journey"
            className="inline-flex items-center gap-1.5 text-brand-yellow font-bold text-sm underline underline-offset-4"
          >
            🔥 המסע שלי — אתגר 14 יום
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-brand-yellow font-bold text-sm underline underline-offset-4"
          >
            📸 פיד הקהילה
          </Link>
        </div>
      </header>

      {/* ===== 3 דברים שחייבים לדעת ===== */}
      <section className="bg-brand-mint px-4 py-6 md:rounded-card md:mt-4 md:mx-4">
        <h2 className="text-lg font-black mb-4">3 דברים שחייבים לדעת</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: <IconThaw />, t: "מפשירים", s: "3 דקות" },
            { icon: <IconTwoCubes />, t: "2 מנות", s: "המינון היומי" },
            { icon: <IconCold />, t: "בלי חימום", s: "רק קר" },
          ].map((k) => (
            <div
              key={k.t}
              className="bg-white rounded-card px-2 py-4 text-center shadow-card border border-brand-line/70"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-mint flex items-center justify-center ring-1 ring-brand-line">
                {k.icon}
              </div>
              <div className="font-black text-[13px] mt-2.5 text-brand-green">{k.t}</div>
              <div className="text-[11px] text-brand-soft mt-0.5">{k.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== חיפוש + רמות + גריד + sheet ===== */}
      <RecipeExplorer />

      {/* ===== שאלות נפוצות ===== */}
      <section className="bg-brand-mint px-4 py-6 mt-8 md:rounded-card md:mx-4">
        <h2 className="text-lg font-black mb-3.5">שאלות ששואלים אותנו</h2>
        <Faq />
      </section>

      {/* ===== וואטסאפ + חנות ===== */}
      <section className="px-4 py-6">
        <div className="bg-brand-green rounded-card text-center text-white px-5 py-7">
          <h2 className="text-xl font-black">מתכון ירוק כל בוקר 💬</h2>
          <p className="text-[13px] text-[#BFD4D2] mt-1.5 mb-4">
            מצטרפים לקהילת הוואטסאפ ומקבלים רעיון יומי של 10 שניות
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-brand-yellow text-brand-green font-extrabold rounded-btn py-3.5"
          >
            אני בפנים
          </a>
          <a
            href={SHOP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-2 border-white/70 text-white font-bold rounded-btn py-3 mt-2.5"
          >
            לרכישה באתר
          </a>
          <a
            href={STORE_LOCATOR_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[13px] text-brand-yellow font-bold underline underline-offset-4 mt-3.5"
          >
            איפה לקנות ספירולינה סביבך? 📍
          </a>
        </div>
      </section>

      <footer className="text-center text-xs text-brand-soft pb-8">
        SimpliiGood © {new Date().getFullYear()} · ספירולינה טרייה-קפואה
      </footer>
    </main>
  );
}
