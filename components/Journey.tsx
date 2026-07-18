"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHALLENGE_DAYS, EMPTY_PROGRESS, getDeviceId, type Progress } from "@/lib/challenge";
import { SHOP_LINK } from "@/lib/recipes";
import { currentPlanDay, recipeForDay } from "@/lib/plan";
import SubscribeCard from "./SubscribeCard";
import UploadCard from "./UploadCard";
import RewardsRoadmap from "./RewardsRoadmap";
import SocialProof from "./SocialProof";
import { RecipePhoto } from "./RecipeCard";

/** המתכון של היום — ה-CTA המרכזי: מוביל ישר למתכון עם זרימת "הכנתי" */
function TodayRecipeCard({ days }: { days: number }) {
  const day = currentPlanDay(days);
  const recipe = recipeForDay(day);
  if (!recipe) return null;
  return (
    <Link
      href={`/?recipe=${recipe.slug}`}
      className="block bg-brand-green text-white rounded-card shadow-card overflow-hidden transition-transform active:scale-[0.98]"
    >
      <div className="flex items-stretch gap-3 p-3">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
          <RecipePhoto recipe={recipe} className="w-24 h-24" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-[11px] font-black text-brand-yellow tracking-wide">
            המתכון של היום · יום {day}/{CHALLENGE_DAYS}
          </div>
          <div className="font-black text-[17px] leading-tight mt-0.5">{recipe.name}</div>
          <div className="text-[12px] text-[#BFD4D2] mt-0.5">
            {recipe.timeLabel} · {recipe.meal}
          </div>
          <span className="inline-flex items-center gap-1 mt-2 self-start bg-brand-yellow text-brand-green font-extrabold text-[13px] rounded-btn px-4 py-1.5">
            להכין ולסמן ✓
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="bg-white rounded-card shadow-card p-4 text-center">
      <div className="text-2xl" aria-hidden>{emoji}</div>
      <div className="text-2xl font-black mt-0.5">{value}</div>
      <div className="text-xs text-brand-soft font-medium">{label}</div>
    </div>
  );
}

function StartCard() {
  return (
    <div className="bg-white rounded-card shadow-card p-6 text-center">
      <div className="text-5xl" aria-hidden>🌱</div>
      <h2 className="text-xl font-black mt-2">המסע שלך מתחיל במנה אחת</h2>
      <p className="text-sm text-brand-soft mt-1.5">
        בחרו מתכון, לחצו &quot;הכנתי!&quot; — וזהו, יום ראשון בכיס. נתראה כאן מחר.
      </p>
      <Link
        href="/#recipes"
        className="inline-block mt-4 bg-brand-yellow text-brand-green font-extrabold rounded-btn px-7 py-3 shadow-btn"
      >
        בחרו מתכון והתחילו ↓
      </Link>
    </div>
  );
}


function KeepGoingCard({ done }: { done: number }) {
  const left = CHALLENGE_DAYS - done;
  return (
    <div className="bg-brand-green rounded-card text-center text-white p-5 mt-3">
      <div className="font-black text-lg">עוד {left} ימים לסיום האתגר 💪</div>
      <p className="text-[13px] text-[#BFD4D2] mt-1 mb-3.5">
        הכינו היום מנה נוספת ושמרו על הרצף
      </p>
      <Link
        href="/#recipes"
        className="block bg-brand-yellow text-brand-green font-extrabold rounded-btn py-3"
      >
        למתכון של היום
      </Link>
    </div>
  );
}

function FinishedCard() {
  return (
    <div className="bg-gradient-to-b from-brand-yellow to-[#FFF6C2] rounded-card text-center p-6 mt-3">
      <div className="text-5xl" aria-hidden>🏆</div>
      <h2 className="text-2xl font-black mt-1">סיימת 14 יום!</h2>
      <p className="text-sm mt-1.5 font-medium">
        הפכת את המנה היומית להרגל. גאים בך. אפשר להמשיך — הרצף ממשיך לרוץ.
      </p>
      <a
        href={SHOP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-brand-green text-white font-extrabold rounded-btn py-3 mt-4"
      >
        לחידוש המלאי בחנות
      </a>
    </div>
  );
}

export default function Journey() {
  const [progress, setProgress] = useState<Progress | null>(null); // null = טוען

  useEffect(() => {
    const id = getDeviceId();
    if (!id) {
      setProgress(EMPTY_PROGRESS);
      return;
    }
    let active = true;
    fetch(`/api/progress?device=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active) setProgress(d?.progress ?? EMPTY_PROGRESS);
      })
      .catch(() => {
        if (active) setProgress(EMPTY_PROGRESS);
      });
    return () => {
      active = false;
    };
  }, []);

  const loading = progress === null;
  const p = progress ?? EMPTY_PROGRESS;
  const hasJourney = p.daysCompleted > 0;
  const done = Math.min(p.daysCompleted, CHALLENGE_DAYS);
  const finished = p.daysCompleted >= CHALLENGE_DAYS;
  const pct = Math.round((done / CHALLENGE_DAYS) * 100);

  return (
    <main className="max-w-3xl mx-auto min-h-screen pb-10">
      <header className="bg-brand-green text-white px-5 pt-6 pb-9 relative overflow-hidden md:rounded-b-[32px]">
        <span className="cube cube-lg absolute left-5 top-8 rotate-[-12deg] opacity-90" aria-hidden />
        <Link href="/" className="text-[13px] text-brand-yellow font-bold">
          ← חזרה למתכונים
        </Link>
        <h1 className="text-[28px] md:text-[38px] font-black mt-3">המסע שלי</h1>
        <p className="text-sm text-[#BFD4D2] mt-1">אתגר 14 יום · 2 מנות ביום</p>
        <Link href="/feed" className="inline-block mt-3 text-[13px] text-brand-yellow font-bold underline underline-offset-4">
          📸 לפיד הקהילה
        </Link>
      </header>

      {loading ? (
        <div className="text-center text-brand-soft py-20">טוען את המסע…</div>
      ) : (
        <div className="px-4 -mt-5">
          {!finished && (
            <div className="mt-6 mb-3">
              <TodayRecipeCard days={p.daysCompleted} />
            </div>
          )}

          {hasJourney ? (
            <>
              {/* רצף */}
              <div className="bg-white rounded-card shadow-card p-5 text-center">
                <div className="text-5xl" aria-hidden>🔥</div>
                <div className="text-4xl font-black mt-1">{p.currentStreak}</div>
                <div className="text-sm text-brand-soft font-medium">
                  {p.currentStreak === 1 ? "יום ברצף" : "ימים ברצף"}
                </div>
              </div>

              {/* גריד 14 יום */}
              <div className="bg-white rounded-card shadow-card p-5 mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-[15px]">
                    {done}/{CHALLENGE_DAYS} ימים
                  </span>
                  <span className="text-xs text-brand-soft">{pct}%</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: CHALLENGE_DAYS }).map((_, i) => {
                    const filled = i < done;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold ${
                          filled ? "bg-brand-green text-brand-yellow" : "bg-brand-mint text-brand-soft"
                        }`}
                        aria-label={filled ? `יום ${i + 1} הושלם` : `יום ${i + 1}`}
                      >
                        {filled ? "✓" : i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* נתונים */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Stat emoji="⭐" value={p.points} label="נקודות" />
                <Stat emoji="🏅" value={p.longestStreak} label="שיא רצף" />
              </div>

            </>
          ) : (
            <StartCard />
          )}

          <SocialProof className="mt-3" />
          <SubscribeCard />
          <div className="mt-3">
            <RewardsRoadmap days={p.daysCompleted} variant="live" />
          </div>
          <UploadCard onProgress={setProgress} />

          {hasJourney && (finished ? <FinishedCard /> : <KeepGoingCard done={done} />)}
        </div>
      )}
    </main>
  );
}
