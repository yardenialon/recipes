"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDeviceId, setDeviceId } from "@/lib/challenge";

const KEY = "sg_subscribed";

export default function SubscribeCard() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "working" | "done" | "already">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) setState("already");
      setName(localStorage.getItem("sg_name") ?? "");
    } catch {
      /* noop */
    }
  }, []);

  if (state === "already") {
    return (
      <div className="bg-white rounded-card shadow-card p-4 mt-3 text-center">
        <div className="text-sm font-extrabold text-brand-green">💬 רשום/ה לתזכורת היומית ✓</div>
        <div className="text-[12px] text-brand-soft mt-0.5">נתראה כל בוקר בוואטסאפ</div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!consent) {
      setErr("צריך לאשר קבלת הודעות כדי להירשם");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setErr("מספר טלפון לא תקין");
      return;
    }
    setState("working");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name: name.trim(), consent: true, deviceId: getDeviceId() }),
      });
      const d = await res.json();
      if (res.status === 503) {
        setErr("התזכורות עדיין לא פעילות. נסו שוב מאוחר יותר.");
        setState("idle");
        return;
      }
      if (!res.ok || !d?.ok) {
        setErr(d?.error === "invalid phone" ? "מספר טלפון לא תקין" : "ההרשמה נכשלה, נסו שוב");
        setState("idle");
        return;
      }
      // עוברים לזהות-הטלפון — מכאן המסע עוקב אחרי המשתמש בכל מכשיר
      if (typeof d.deviceId === "string") setDeviceId(d.deviceId);
      try {
        localStorage.setItem(KEY, "1");
      } catch {
        /* noop */
      }
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ההרשמה נכשלה");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="bg-brand-green text-white rounded-card p-5 mt-3 text-center">
        <div className="text-3xl" aria-hidden>💬</div>
        <div className="font-black text-lg mt-1">נרשמת לתזכורות!</div>
        <p className="text-[13px] text-[#C4DAD6] mt-1">
          ההודעה הראשונה בוואטסאפ בדרך. נתראה כל בוקר עם מנה חדשה.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 mt-3">
      <div className="flex items-center gap-3">
        <div className="text-3xl" aria-hidden>💬</div>
        <div>
          <div className="font-extrabold text-[15px]">תזכורת יומית בוואטסאפ</div>
          <div className="text-xs text-brand-soft mt-0.5">
            מתכון + תזכורת כל בוקר — כדי לא לשבור את הרצף
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="mt-3">
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="מספר טלפון (05X-XXXXXXX)"
          className="w-full rounded-btn border border-brand-line px-4 py-2.5 text-sm"
          dir="ltr"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder="שם (אופציונלי)"
          className="w-full mt-2 rounded-btn border border-brand-line px-4 py-2.5 text-sm"
        />
        <label className="flex items-start gap-2 mt-3 text-[12px] text-brand-soft cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>
            אני מאשר/ת קבלת הודעות וואטסאפ מ-SimpliiGood. אפשר להסיר בכל עת.{" "}
            <Link href="/privacy" className="underline">
              מדיניות פרטיות
            </Link>
          </span>
        </label>
        <button
          type="submit"
          disabled={state === "working"}
          className="w-full mt-3 rounded-btn py-3 font-extrabold bg-brand-green text-white disabled:opacity-60"
        >
          {state === "working" ? "רושם…" : "שלחו לי תזכורת יומית"}
        </button>
        {err && <div className="text-xs text-red-500 font-bold mt-2 text-center break-words">{err}</div>}
      </form>
    </div>
  );
}
