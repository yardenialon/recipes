import RecipeExplorer from "@/components/RecipeExplorer";
import Faq from "@/components/Faq";
import { RECIPES, WHATSAPP_LINK, SHOP_LINK } from "@/lib/recipes";

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
          2 קוביות ביום.
          <br />
          <span className="text-brand-yellow">ככה פשוט.</span>
        </h1>
        <p className="text-sm md:text-base text-[#BFD4D2] mt-2.5 max-w-md">
          כל הדרכים לשלב ספירולינה טרייה ביומיום — בלי להיות שף ובלי לשנות הרגלים.
        </p>
        <a
          href="#recipes"
          className="inline-block mt-5 bg-brand-yellow text-brand-green font-extrabold rounded-btn px-8 py-3.5 shadow-btn transition-transform active:scale-[0.97]"
        >
          גלו איך מתחילים ↓
        </a>
      </header>

      {/* ===== 3 דברים שחייבים לדעת ===== */}
      <section className="bg-brand-mint px-4 py-5 md:rounded-card md:mt-4 md:mx-4">
        <h2 className="text-lg font-black mb-3.5">3 דברים שחייבים לדעת</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { e: "🧊", t: "מפשירים", s: "5 דק' בחוץ" },
            { e: "✌️", t: "2 קוביות", s: "המינון היומי" },
            { e: "🥶", t: "בלי חימום", s: "רק קר" },
          ].map((k) => (
            <div key={k.t} className="bg-white rounded-2xl px-2 py-3 text-center shadow-card">
              <div className="text-2xl" aria-hidden>{k.e}</div>
              <div className="font-bold text-[13px] mt-1.5">{k.t}</div>
              <div className="text-[11px] text-brand-soft">{k.s}</div>
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
            לרכישה בחנות
          </a>
        </div>
      </section>

      <footer className="text-center text-xs text-brand-soft pb-8">
        SimpliiGood © {new Date().getFullYear()} · ספירולינה טרייה-קפואה
      </footer>
    </main>
  );
}
