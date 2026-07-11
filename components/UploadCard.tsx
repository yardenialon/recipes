"use client";

import { useEffect, useRef, useState } from "react";
import { getDeviceId, type Progress } from "@/lib/challenge";
import { resizeImage, UPLOAD_POINTS } from "@/lib/upload";
import { INSTAGRAM_URL, SHARE_CAPTION } from "@/lib/recipes";

export default function UploadCard({
  onProgress,
  title = "שתפו את היצירה שלכם",
  subtitle = `תמונה של המנה — ${UPLOAD_POINTS} נק' ליום`,
}: {
  onProgress: (p: Progress) => void;
  title?: string;
  subtitle?: string;
}) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [shareBlob, setShareBlob] = useState<Blob | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function shareToInstagram() {
    // Web Share עם הקובץ (מובייל) — המשתמש בוחר Instagram; אחרת נפילה לחלופה
    try {
      if (shareBlob && typeof navigator !== "undefined" && navigator.canShare) {
        const file = new File([shareBlob], "simpliigood.webp", { type: "image/webp" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: SHARE_CAPTION, title: "SimpliiGood" });
          return;
        }
      }
    } catch {
      /* המשתמש ביטל או שאין תמיכה — ממשיכים לחלופה */
    }
    try {
      await navigator.clipboard?.writeText(SHARE_CAPTION);
      setShareMsg("הכיתוב הועתק — הדביקו באינסטגרם ותייגו @simpliigood");
    } catch {
      setShareMsg("תייגו אותנו @simpliigood ותשתמשו ב-#SimpliiGood");
    }
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  }

  async function copyCaption() {
    try {
      await navigator.clipboard?.writeText(SHARE_CAPTION);
      setShareMsg("הכיתוב הועתק ✓");
    } catch {
      setShareMsg(SHARE_CAPTION);
    }
  }

  useEffect(() => {
    try {
      setName(localStorage.getItem("sg_name") ?? "");
    } catch {
      /* noop */
    }
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // מאפשר לבחור שוב את אותו קובץ
    if (!file) return;
    setState("working");
    setMsg("");
    try {
      const trimmed = name.trim();
      try {
        if (trimmed) localStorage.setItem("sg_name", trimmed);
      } catch {
        /* noop */
      }
      const blob = await resizeImage(file);
      const fd = new FormData();
      fd.append("deviceId", getDeviceId());
      fd.append("name", trimmed);
      fd.append("file", new File([blob], "upload.webp", { type: "image/webp" }));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok || !d?.ok) throw new Error(d?.error || "failed");
      if (d.progress) onProgress(d.progress as Progress);
      setShareBlob(blob);
      setShareMsg("");
      setState("done");
      setMsg(
        d.awarded
          ? `תודה! +${UPLOAD_POINTS} נקודות 🎉 התמונה ממתינה לאישור`
          : "תודה! התמונה התקבלה (היום כבר קיבלת נקודות על העלאה)"
      );
    } catch {
      setState("error");
      setMsg("ההעלאה נכשלה. נסו שוב עם תמונה אחרת.");
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 mt-3 text-right">
      <div className="flex items-center gap-3">
        <div className="text-3xl" aria-hidden>📸</div>
        <div>
          <div className="font-extrabold text-[15px]">{title}</div>
          <div className="text-xs text-brand-soft mt-0.5">{subtitle}</div>
        </div>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 40))}
        placeholder="שם לקרדיט בפיד (אופציונלי)"
        className="w-full mt-3 rounded-btn border border-brand-line px-4 py-2.5 text-sm"
      />
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={state === "working"}
        className="w-full mt-2 rounded-btn py-3 font-extrabold bg-brand-green text-white disabled:opacity-60"
      >
        {state === "working" ? "מעלה…" : "בחירת תמונה"}
      </button>
      {msg && (
        <div
          className={`text-xs mt-2 text-center font-bold ${
            state === "error" ? "text-red-500" : "text-brand-green"
          }`}
        >
          {msg}
        </div>
      )}

      {state === "done" && (
        <div className="mt-3 border-t border-brand-line pt-3">
          <div className="text-[13px] font-extrabold text-center mb-2">שתפו בסטורי ותייגו אותנו 💚</div>
          <div className="flex gap-2">
            <button
              onClick={shareToInstagram}
              className="flex-1 rounded-btn py-2.5 font-extrabold text-sm bg-brand-green text-white"
            >
              שיתוף לאינסטגרם 📸
            </button>
            <button
              onClick={copyCaption}
              className="rounded-btn py-2.5 px-4 font-bold text-sm bg-brand-mint text-brand-green"
            >
              העתק כיתוב
            </button>
          </div>
          <div className="text-[11px] text-brand-soft mt-2 text-center">
            {shareMsg || "תייגו @simpliigood + #SimpliiGood — ואולי תופיעו בפיד שלנו"}
          </div>
        </div>
      )}

      <p className="text-[11px] text-brand-soft mt-2 text-center">
        המדיה נבדקת לפני שהיא מוצגת. בהעלאה אתם מאשרים שהתוכן שלכם ומתאים לשיתוף.
      </p>
    </div>
  );
}
