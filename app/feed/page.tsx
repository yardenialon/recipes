import type { Metadata } from "next";
import Feed from "@/components/Feed";

export const metadata: Metadata = {
  title: "פיד הקהילה — SimpliiGood",
  description: "תמונות מהקהילה: מנות ספירולינה טרייה שאנשים מכינים בבית.",
};

export default function FeedPage() {
  return <Feed />;
}
