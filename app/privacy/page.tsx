import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — SimpliiGood",
  description: "איזה מידע אנחנו אוספים ואיך אנחנו שומרים עליו.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto min-h-screen px-5 py-10">
      <Link href="/" className="text-[13px] text-brand-green font-bold">
        ← חזרה לאתר
      </Link>
      <h1 className="text-2xl font-black mt-3 mb-2">מדיניות פרטיות</h1>
      <p className="text-sm text-brand-soft mb-6">אתגר הספירולינה של SimpliiGood</p>

      <div className="space-y-5 text-[14px] leading-relaxed text-brand-green">
        <section>
          <h2 className="font-black text-[16px] mb-1">איזה מידע נאסף</h2>
          <p>
            שימוש רגיל באתר (עיון במתכונים, &quot;הכנתי!&quot;, מסע האתגר) הוא{" "}
            <b>אנונימי</b> — נשמר מזהה מקרי בדפדפן שלכם, בלי שם או פרטים מזהים.
          </p>
          <p className="mt-2">
            אם תבחרו להירשם ל<b>תזכורות וואטסאפ</b>, נאסף מספר הטלפון (ושם אם מסרתם) —
            רק לצורך משלוח התזכורות היומיות של האתגר.
          </p>
        </section>

        <section>
          <h2 className="font-black text-[16px] mb-1">איך המידע נשמר</h2>
          <p>
            מספר הטלפון נשמר אצל ספק הדיוור שלנו (Flashy) לצורך שליחת ההודעות, ולא
            נמכר או מועבר לצד שלישי. תמונות שאתם מעלים נשמרות באחסון פרטי ומוצגות רק
            לאחר אישור.
          </p>
        </section>

        <section>
          <h2 className="font-black text-[16px] mb-1">הסכמה והסרה</h2>
          <p>
            ההרשמה לתזכורות היא בהסכמה מפורשת בלבד. אפשר להפסיק לקבל הודעות בכל עת —
            בתגובה &quot;הסר&quot; להודעת וואטסאפ, או בפנייה אלינו. ההסרה מיידית.
          </p>
        </section>

        <section>
          <h2 className="font-black text-[16px] mb-1">יצירת קשר</h2>
          <p>
            לשאלות בנושא פרטיות אפשר לפנות אלינו דרך{" "}
            <a href="https://simpliigood.co.il" className="underline" target="_blank" rel="noopener noreferrer">
              simpliigood.co.il
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
