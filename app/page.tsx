import Link from "next/link";
import RecipeExplorer from "@/components/RecipeExplorer";
import Faq from "@/components/Faq";
import SubscribeCard from "@/components/SubscribeCard";
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
      <header className="relative overflow-hidden text-white md:rounded-b-[36px]">
        {/* רקע — גרדיאנט עומק */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C525C] via-brand-green to-[#0B2B30]" aria-hidden />

        <div className="relative max-w-5xl mx-auto px-5 pt-8 pb-9 md:px-10 md:pt-12 md:pb-14 md:grid md:grid-cols-2 md:gap-8 md:items-center">
          {/* טקסט */}
          <div className="text-center md:text-right">
            <div className="text-[11px] font-black text-brand-yellow tracking-[0.25em] mb-3">
              SIMPLIIGOOD
            </div>
            <span className="inline-flex items-center gap-1.5 bg-white/10 ring-1 ring-white/15 rounded-full px-3 py-1 text-[11px] font-bold text-white/90 mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" aria-hidden />
              ספירולינה טרייה-קפואה · בלי חימום
            </span>
            <h1 className="text-[34px] md:text-[48px] font-black leading-[1.08]">
              2 מנות ביום.
              <br />
              <span className="text-brand-yellow">ככה פשוט.</span>
            </h1>
            <p className="text-sm md:text-base text-[#C4DAD6] mt-3 max-w-md mx-auto md:mx-0">
              כל הדרכים לשלב ספירולינה טרייה ביומיום — בלי להיות שף ובלי לשנות הרגלים.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <a
                href="#join"
                className="inline-block bg-brand-yellow text-brand-green font-extrabold rounded-btn px-7 py-3.5 shadow-btn transition-transform active:scale-[0.97]"
              >
                הצטרפו לאתגר — מתכון כל בוקר 💬
              </a>
              <a
                href="#recipes"
                className="inline-flex items-center gap-1.5 bg-white/10 ring-1 ring-white/15 rounded-btn px-4 py-3 text-sm font-bold hover:bg-white/15 transition-colors"
              >
                לכל המתכונים ↓
              </a>
              <Link
                href="/journey"
                className="inline-flex items-center gap-1.5 bg-white/10 ring-1 ring-white/15 rounded-btn px-4 py-3 text-sm font-bold hover:bg-white/15 transition-colors"
              >
                🔥 המסע שלי
              </Link>
            </div>
          </div>

          {/* מנת המוצר — עם הילה קרה שמפרידה אותה מהרקע */}
          <div className="relative mt-9 md:mt-0 flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="w-[92%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(190,235,222,0.6),rgba(127,209,185,0.18)_45%,transparent_68%)] blur-2xl" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/product/portion-3q.webp"
              alt="מנת ספירולינה טרייה-קפואה של SimpliiGood"
              className="relative w-[80%] max-w-[340px] md:w-full md:max-w-[440px] drop-shadow-[0_26px_50px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </header>

      {/* ===== איך מצטרפים לאתגר ===== */}
      <section className="px-4 pt-6 md:mx-4">
        <h2 className="text-lg md:text-xl font-black text-center">איך מצטרפים לאתגר? 🌱</h2>
        <p className="text-[13px] text-brand-soft text-center mt-1 mb-4 max-w-md mx-auto">
          14 יום, מנה ירוקה כל בוקר — ואנחנו מזכירים לכם. פשוט ככה:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { e: "📲", t: "מצטרפים", d: "משאירים טלפון — ומקבלים מתכון קצר כל בוקר בוואטסאפ" },
            { e: "🥤", t: "מכינים", d: "2 מנות ספירולינה במתכון של 10 שניות שאוהבים" },
            { e: "🔥", t: 'מסמנים "הכנתי!"', d: "צוברים רצף ימים, נקודות ותגים — עד קופון" },
          ].map((s, i) => (
            <div
              key={s.t}
              className="bg-white rounded-card shadow-card p-4 flex items-center gap-3 sm:flex-col sm:text-center border border-brand-line/70"
            >
              <div className="w-10 h-10 rounded-full bg-brand-green text-brand-yellow font-black text-lg flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="sm:mt-1">
                <div className="font-extrabold text-[14px]">
                  <span aria-hidden>{s.e}</span> {s.t}
                </div>
                <div className="text-[12px] text-brand-soft mt-0.5 leading-snug">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <a
            href="#join"
            className="inline-block bg-brand-yellow text-brand-green font-extrabold rounded-btn px-8 py-3.5 shadow-btn transition-transform active:scale-[0.97]"
          >
            מצטרפים לאתגר 💬
          </a>
          <p className="text-[12px] text-brand-soft mt-2">בחינם · מתחילים היום · אפשר להסיר בכל עת</p>
        </div>
      </section>

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

      {/* ===== הצטרפות לאתגר (מתכון יומי בוואטסאפ) ===== */}
      <section id="join" className="px-4 py-6 scroll-mt-4">
        <div className="bg-brand-green rounded-card text-white px-5 py-7">
          <h2 className="text-xl md:text-2xl font-black text-center">
            מתכון כל בוקר בוואטסאפ 💬
          </h2>
          <p className="text-[13px] text-[#BFD4D2] mt-1.5 text-center max-w-sm mx-auto">
            הצטרפו לאתגר 14 יום — כל בוקר מתכון של 10 שניות ותזכורת קטנה, ישר לוואטסאפ.
          </p>

          <div className="max-w-md mx-auto">
            <SubscribeCard />
          </div>

          <div className="max-w-md mx-auto mt-4">
            <a
              href={SHOP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-white/70 text-white font-bold rounded-btn py-3 text-center"
            >
              לרכישה באתר
            </a>
            <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-1 mt-3 text-[13px]">
              <a
                href={STORE_LOCATOR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-yellow font-bold underline underline-offset-4"
              >
                איפה לקנות סביבך? 📍
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#BFD4D2] font-bold underline underline-offset-4"
              >
                יש שאלה? דברו איתנו
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-brand-soft pb-8">
        SimpliiGood © {new Date().getFullYear()} · ספירולינה טרייה-קפואה
      </footer>
    </main>
  );
}
