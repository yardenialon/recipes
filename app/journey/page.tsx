import type { Metadata } from "next";
import Journey from "@/components/Journey";

export const metadata: Metadata = {
  title: "המסע שלי · אתגר 14 יום — SimpliiGood",
  description: "המעקב האישי שלך אחרי אתגר 14 הימים עם ספירולינה טרייה: רצף, ימים שהושלמו ונקודות.",
  robots: { index: false }, // עמוד אישי — לא לאינדוקס
};

export default function JourneyPage() {
  return <Journey />;
}
