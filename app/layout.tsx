import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimpliiGood — איך משתמשים בספירולינה טרייה | 2 מנות ביום, ככה פשוט",
  description:
    "כל הדרכים לשלב ספירולינה טרייה-קפואה ביומיום: מתכוני 10 שניות, שייקים של דקה, וקינוחים ירוקים שהילדים יאהבו. בעברית, פשוט, בלי להיות שף.",
  keywords: ["ספירולינה", "ספירולינה קפואה", "מתכונים עם ספירולינה", "SimpliiGood", "סופרפוד"],
  openGraph: {
    title: "2 מנות ביום. ככה פשוט. | SimpliiGood",
    description: "מתכוני ספירולינה של 10 שניות ועד קינוחים ירוקים — הכל בעברית.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/*
          Heebo נטען כ-link כדי שהבנייה לא תלויה ברשת.
          אופטימיזציה אחרי פריסה: לעבור ל-next/font/google (self-hosting אוטומטי) — ראו README.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-heebo bg-white text-brand-green antialiased">{children}</body>
    </html>
  );
}
