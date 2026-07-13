"use client";

import { useMemo, useState } from "react";
import { LEVELS, Level, RECIPES, Recipe, WHATSAPP_LINK } from "@/lib/recipes";
import RecipeCard from "./RecipeCard";
import RecipeSheet from "./RecipeSheet";

export default function RecipeExplorer() {
  const [level, setLevel] = useState<Level>(1);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Recipe | null>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (q) {
      // חיפוש בשם, במרכיבים ובתגיות — "יש לי יוגורט בבית" הוא ה-use case האמיתי
      return RECIPES.filter(
        (r) =>
          r.name.includes(q) ||
          r.ingredients.some((i) => i.includes(q)) ||
          r.tags.some((t) => t.includes(q))
      );
    }
    return RECIPES.filter((r) => r.level === level);
  }, [level, query]);

  const activeLevel = LEVELS.find((l) => l.id === level)!;
  const searching = query.trim().length > 0;

  return (
    <section id="recipes" className="px-4 pt-8 scroll-mt-4">
      {/* כותרת הסקשן — בשפת ה-hero */}
      <div className="text-center mb-4">
        <div className="text-[11px] font-black text-brand-green/70 tracking-[0.22em] mb-1.5">
          ספר המתכונים
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-brand-green">מה מכינים היום? 🥑</h2>
        <p className="text-[13px] text-brand-soft mt-1.5 max-w-md mx-auto">
          בחרו רמה — או חפשו לפי מרכיב שיש לכם כבר בבית
        </p>
      </div>

      {/* חיפוש */}
      <label className="flex items-center gap-2 border border-brand-line rounded-btn px-4 py-3 bg-white shadow-card transition focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/25">
        <span aria-hidden className="text-brand-soft/70">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש מתכון או מרכיב… (למשל: יוגורט)"
          className="w-full bg-transparent outline-none text-sm placeholder:text-brand-soft"
          aria-label="חיפוש מתכון או מרכיב"
        />
      </label>

      {/* בורר רמות — sticky */}
      {!searching && (
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm py-3 -mx-4 px-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`shrink-0 rounded-btn px-4 py-2 text-sm font-bold border transition-all ${
                level === l.id
                  ? "bg-brand-green text-brand-yellow border-brand-green shadow-card"
                  : "bg-white text-brand-green border-brand-line hover:border-brand-green"
              }`}
              aria-pressed={level === l.id}
            >
              {l.emoji} {l.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-baseline justify-between gap-3 mt-2">
        <h3 className="text-lg font-black text-brand-green">
          {searching ? `תוצאות עבור "${query.trim()}"` : `${activeLevel.emoji} ${activeLevel.title}`}
        </h3>
        {results.length > 0 && (
          <span className="shrink-0 text-[12px] font-bold text-brand-soft">
            {results.length} מתכונים
          </span>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3.5">
          {results.map((r) => (
            <RecipeCard key={r.slug} recipe={r} onOpen={() => setOpen(r)} />
          ))}
        </div>
      ) : (
        /* מצב ריק = הזמנה לפעולה + ערוץ מחקר מוצר */
        <div className="bg-brand-mint rounded-card p-6 mt-4 text-center">
          <div className="text-3xl" aria-hidden>🤔</div>
          <p className="font-bold mt-2">
            אין לנו עדיין מתכון עם "{query.trim()}" — רוצים שנכין?
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-brand-green text-white font-bold rounded-btn px-6 py-2.5 text-sm"
          >
            ספרו לנו בוואטסאפ
          </a>
          <div className="text-right mt-6">
            <div className="font-extrabold text-sm mb-2.5">בינתיים, הפופולריים שלנו:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...RECIPES]
                .sort((a, b) => b.baseMadeCount - a.baseMadeCount)
                .slice(0, 4)
                .map((r) => (
                  <RecipeCard key={r.slug} recipe={r} onOpen={() => setOpen(r)} />
                ))}
            </div>
          </div>
        </div>
      )}

      {open && (
        <RecipeSheet recipe={open} onClose={() => setOpen(null)} onOpenRecipe={(r) => setOpen(r)} />
      )}
    </section>
  );
}
