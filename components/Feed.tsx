"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FeedItem {
  id: number;
  url: string;
  createdAt: string;
  name: string | null;
}

export default function Feed() {
  const [items, setItems] = useState<FeedItem[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/feed", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active) setItems(d?.items ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="max-w-3xl mx-auto min-h-screen pb-12">
      <header className="bg-brand-green text-white px-5 pt-6 pb-9 relative overflow-hidden md:rounded-b-[32px]">
        <span className="cube cube-lg absolute left-5 top-8 rotate-[-12deg] opacity-90" aria-hidden />
        <Link href="/" className="text-[13px] text-brand-yellow font-bold">
          ← חזרה למתכונים
        </Link>
        <h1 className="text-[28px] md:text-[38px] font-black mt-3">פיד הקהילה</h1>
        <p className="text-sm text-[#BFD4D2] mt-1">מה שאתם מכינים עם ספירולינה טרייה</p>
      </header>

      <div className="px-4 mt-5">
        {items === null ? (
          <div className="text-center text-brand-soft py-20">טוען…</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-card shadow-card p-8 text-center">
            <div className="text-5xl" aria-hidden>📸</div>
            <h2 className="text-xl font-black mt-2">עוד אין תמונות כאן</h2>
            <p className="text-sm text-brand-soft mt-1.5">
              היו הראשונים לשתף — כל תמונה מזכה בנקודות.
            </p>
            <Link
              href="/journey"
              className="inline-block mt-4 bg-brand-yellow text-brand-green font-extrabold rounded-btn px-7 py-3 shadow-btn"
            >
              להעלאת תמונה
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {items.map((item) => (
              <figure key={item.id} className="relative rounded-2xl overflow-hidden shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name ? `יצירה של ${item.name}` : "יצירת קהילה"}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                />
                {item.name && (
                  <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[12px] font-bold px-2.5 py-2">
                    {item.name}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
