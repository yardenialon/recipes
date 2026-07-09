"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHALLENGE_DAYS, EMPTY_PROGRESS, getDeviceId, type Progress } from "@/lib/challenge";
import { badgeStatus, rewardStatus, REWARD } from "@/lib/rewards";
import { WHATSAPP_LINK, SHOP_LINK } from "@/lib/recipes";

function Stat({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="bg-white rounded-card shadow-card p-4 text-center">
      <div className="text-2xl" aria-hidden>{emoji}</div>
      <div className="text-2xl font-black mt-0.5">{value}</div>
      <div className="text-xs text-brand-soft font-medium">{label}</div>
    </div>
  );
}

function BadgesCard({ days }: { days: number }) {
  const badges = badgeStatus(days);
  return (
    <div className="bg-white rounded-card shadow-card p-5 mt-3">
      <div className="font-extrabold text-[15px] mb-3">התגים שלי</div>
      <div className="grid grid-cols-4 gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`rounded-xl p-2.5 text-center ${b.earned ? "bg-brand-mint" : "bg-brand-mint/40"}`}
          >
            <div className={`text-2xl ${b.earned ? "" : "grayscale opacity-40"}`} aria-hidden>
              {b.emoji}
            </div>
            <div className={`text-[11px] font-bold mt-1 ${b.earned ? "" : "text-brand-soft"}`}>
              {b.title}
            </div>
            <div className="text-[10px] text-brand-soft">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardCard({ points }: { points: number }) {
  const { unlocked, remaining } = rewardStatus(points);
  const [copied, setCopied] = useState(false);
  const pct = Math.min(100, Math.round((points / REWARD.pointsNeeded) * 100));

  if (!unlocked) {
    return (
      <div className="bg-white rounded-card shadow-card p-5 mt-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl" aria-hidden>🎁</div>
          <div>
            <div className="font-extrabold text-[15px]">קוד הנחה מחכה לך</div>
            <div className="text-xs text-brand-soft mt-0.5">
              עוד {remaining} נקודות ל{REWARD.label}
            </div>
          </div>
        </div>
        <div className="h-2 bg-brand-mint rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-brand-green rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-green text-white rounded-card p-5 mt-3 text-center">
      <div className="text-3xl" aria-hidden>🎁</div>
      <div className="font-black text-lg mt-1">פתחת {REWARD.label}!</div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(REWARD.code).catch(() => {});
          setCopied(true);
        }}
        className="mt-3 inline-flex items-center gap-2 bg-brand-yellow text-brand-green font-black rounded-btn px-5 py-2.5 tracking-widest"
      >
        {REWARD.code} <span aria-hidden>{copied ? "✓" : "📋"}</span>
      </button>
      <div className="text-[12px] text-[#BFD4D2] mt-2">
        {copied ? "הקוד הועתק" : "העתיקו את הקוד"} · ממשים בקנייה
      </div>
      <a
        href={SHOP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-brand-yellow text-brand-green font-extrabold rounded-btn py-3 mt-3"
      >
        לחנות
      </a>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 -mt-5">
      <div className="bg-white rounded-card shadow-card p-6 text-center">
        <div className="text-5xl" aria-hidden>🌱</div>
        <h2 className="text-xl font-black mt-2">המסע שלך מתחיל בקובייה אחת</h2>
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
    </div>
  );
}

function KeepGoingCard({ done }: { done: number }) {
  const left = CHALLENGE_DAYS - done;
  return (
    <div className="bg-brand-green rounded-card text-center text-white p-5 mt-3">
      <div className="font-black text-lg">עוד {left} ימים לסיום האתגר 💪</div>
      <p className="text-[13px] text-[#BFD4D2] mt-1 mb-3.5">
        הכינו היום קובייה נוספת ושמרו על הרצף
      </p>
      <Link
        href="/#recipes"
        className="block bg-brand-yellow text-brand-green font-extrabold rounded-btn py-3"
      >
        למתכון של היום
      </Link>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[13px] text-brand-yellow font-bold underline underline-offset-4 mt-3"
      >
        תזכורת יומית בוואטסאפ 💬
      </a>
    </div>
  );
}

function FinishedCard() {
  return (
    <div className="bg-gradient-to-b from-brand-yellow to-[#FFF6C2] rounded-card text-center p-6 mt-3">
      <div className="text-5xl" aria-hidden>🏆</div>
      <h2 className="text-2xl font-black mt-1">סיימת 14 יום!</h2>
      <p className="text-sm mt-1.5 font-medium">
        הפכת את הקובייה היומית להרגל. גאים בך. אפשר להמשיך — הרצף ממשיך לרוץ.
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
    fetch(`/api/progress?device=${encodeURIComponent(id)}`)
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
        <p className="text-sm text-[#BFD4D2] mt-1">אתגר 14 יום · 2 קוביות ביום</p>
      </header>

      {loading ? (
        <div className="text-center text-brand-soft py-20">טוען את המסע…</div>
      ) : p.daysCompleted === 0 ? (
        <EmptyState />
      ) : (
        <div className="px-4 -mt-5">
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

          <BadgesCard days={p.daysCompleted} />
          <RewardCard points={p.points} />

          {finished ? <FinishedCard /> : <KeepGoingCard done={done} />}
        </div>
      )}
    </main>
  );
}
