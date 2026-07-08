"use client";

import { useEffect, useMemo, useState } from "react";
import { Recipe, RECIPES, WHATSAPP_LINK } from "@/lib/recipes";
import RecipeCard, { CubesMeter, RecipePhoto } from "./RecipeCard";

const COLORS = ["#FEE62D", "#0E5B4A", "#154048", "#7FD1B9"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
      })),
    []
  );
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </>
  );
}

/** מפתח localStorage: מניעת "הכנתי!" כפול באותו יום לאותו מתכון */
function madeKey(slug: string) {
  return `made:${slug}:${new Date().toISOString().slice(0, 10)}`;
}

export default function RecipeSheet({
  recipe,
  onClose,
  onOpenRecipe,
}: {
  recipe: Recipe;
  onClose: () => void;
  onOpenRecipe: (r: Recipe) => void;
}) {
  const [made, setMade] = useState(false);
  const [alreadyToday, setAlreadyToday] = useState(false);
  const [count, setCount] = useState(recipe.baseMadeCount);

  useEffect(() => {
    setMade(false);
    setCount(recipe.baseMadeCount);
    setAlreadyToday(typeof window !== "undefined" && !!localStorage.getItem(madeKey(recipe.slug)));

    // מוסיפים את הספירה האמיתית מה-DB מעל מונה הבסיס (0 אם Supabase לא מחובר)
    let active = true;
    fetch(`/api/made?slug=${encodeURIComponent(recipe.slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.ok && typeof d.count === "number") {
          setCount(recipe.baseMadeCount + d.count);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [recipe]);

  // נעילת גלילת רקע כשה-sheet פתוח
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const suggestions = useMemo(
    () => RECIPES.filter((r) => r.slug !== recipe.slug && r.level <= 2).slice(0, 2),
    [recipe]
  );

  async function handleMade() {
    if (alreadyToday) return;
    setMade(true);
    setCount((c) => c + 1);
    localStorage.setItem(madeKey(recipe.slug), "1");
    setAlreadyToday(true);
    // fire-and-forget — לא חוסמים UI על רשת
    fetch("/api/made", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: recipe.slug }),
    }).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={recipe.name}>
      {made && <Confetti />}
      <div className="absolute inset-0 bg-brand-green/50" onClick={onClose} aria-hidden />
      <div className="sheet-enter absolute bottom-0 inset-x-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[560px] md:rounded-card bg-white rounded-t-[26px] max-h-[88vh] md:max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white pt-2.5 pb-1 z-10">
          <button onClick={onClose} aria-label="סגירה" className="block mx-auto">
            <span className="block w-10 h-1.5 bg-brand-line rounded-full" />
          </button>
        </div>

        {made ? (
          /* ===== מצב הצלחה — הרקע הצהוב היחיד במערכת ===== */
          <div>
            <div className="bg-gradient-to-b from-brand-yellow to-[#FFF6C2] text-center px-5 pt-8 pb-7">
              <div className="text-5xl" aria-hidden>🎉</div>
              <h3 className="text-2xl font-black mt-2">כל הכבוד!</h3>
              <p className="text-sm mt-1.5 font-medium">
                זו ההתחלה של הרגל חדש.
                <br />
                נתראה מחר עם הקובייה הבאה?
              </p>
            </div>
            <div className="p-5">
              <div className="font-extrabold text-[15px] mb-3">אולי בא לך גם…</div>
              <div className="grid grid-cols-2 gap-2.5">
                {suggestions.map((r) => (
                  <RecipeCard key={r.slug} recipe={r} onOpen={() => onOpenRecipe(r)} />
                ))}
              </div>
              <div className="bg-brand-green rounded-card text-center text-white p-5 mt-4">
                <div className="font-black text-lg">רוצים כזה כל בוקר?</div>
                <p className="text-[13px] text-[#BFD4D2] mt-1 mb-3.5">
                  מתכון של 10 שניות, ישר לוואטסאפ, כל יום ב-7:00
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-brand-yellow text-brand-green font-extrabold rounded-btn py-3"
                >
                  שלחו לי מתכון יומי
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ===== מצב מתכון ===== */
          <div className="px-4 pb-6">
            <RecipePhoto recipe={recipe} className="h-36 w-full rounded-2xl" />
            <h3 className="text-[22px] font-black mt-3">{recipe.name}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="bg-brand-yellow rounded-full px-3 py-1 text-xs font-bold">
                ⚡ {recipe.timeLabel}
              </span>
              <span className="bg-brand-mint rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                <CubesMeter count={recipe.cubes} size={13} />
                {recipe.cubes === 1 ? "קובייה אחת" : `${recipe.cubes} קוביות`}
              </span>
              <span className="bg-brand-mint rounded-full px-3 py-1 text-xs font-bold">
                🍽️ {recipe.meal}
              </span>
            </div>

            <div className="bg-brand-mint rounded-2xl p-4 mt-4">
              <div className="font-extrabold text-[15px]">מה צריך</div>
              <ul className="mt-1.5">
                {recipe.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-center gap-2.5 py-1.5 text-sm border-b border-dashed border-brand-line last:border-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" aria-hidden />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="font-extrabold text-[15px]">איך מכינים</div>
              <ol className="mt-1.5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 py-1.5 text-sm">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-brand-yellow font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-xs text-brand-soft mt-2 bg-white border border-brand-line rounded-xl px-3 py-2">
              <b className="text-brand-green">ערכים: </b>
              {recipe.nutrition}
            </div>

            <button
              onClick={handleMade}
              disabled={alreadyToday}
              className={`w-full mt-4 rounded-btn py-3.5 font-extrabold text-base transition-transform active:scale-[0.98] ${
                alreadyToday
                  ? "bg-brand-mint text-brand-soft cursor-default"
                  : "bg-brand-yellow text-brand-green shadow-btn"
              }`}
            >
              {alreadyToday ? "הכנת היום ✓" : "הכנתי! 🎉"}
            </button>
            <div className="text-center text-xs text-brand-soft mt-2">
              <b className="text-brand-cube">{count} אנשים</b> הכינו את זה השבוע
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
