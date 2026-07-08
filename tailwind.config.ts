import type { Config } from "tailwindcss";

// טוקנים משלב העיצוב המאושר — אל תוסיפו צבעים בלי החלטה מודעת
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FEE62D",
          green: "#154048",
          cube: "#0E5B4A",
          mint: "#EAF3EF",
          soft: "#4A6A70",
          line: "#E3ECE9",
        },
      },
      borderRadius: {
        card: "20px",
        btn: "28px",
        cube: "9px",
      },
      boxShadow: {
        card: "0 6px 24px rgba(21,64,72,.10)",
        btn: "0 4px 14px rgba(254,230,45,.45)",
      },
      fontFamily: {
        heebo: ["Heebo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
