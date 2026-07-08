"use client";

import { useState } from "react";
import { FAQS } from "@/lib/recipes";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-2xl px-4 py-1 shadow-card">
      {FAQS.map((f, i) => (
        <div key={f.q} className="border-b border-brand-line last:border-none">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center py-3.5 text-right font-bold text-sm"
            aria-expanded={open === i}
          >
            <span>{f.q}</span>
            <span className="text-brand-cube font-black text-lg" aria-hidden>
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && <p className="pb-3.5 text-sm text-brand-soft leading-relaxed">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
