import { Alexandria, Allura, Aref_Ruqaa, DM_Sans, Fraunces } from "next/font/google";

const arabic = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-ar", display: "swap" });
const english = DM_Sans({ subsets: ["latin"], variable: "--font-en", display: "swap" });
const englishDisplay = Fraunces({ subsets: ["latin"], variable: "--font-en-display", display: "swap" });
// Hand-lettered accents only ("Handmade with love", "Just for you"); not preloaded to keep LCP light.
const englishScript = Allura({ weight: "400", subsets: ["latin"], variable: "--font-en-script", display: "swap", preload: false });
const arabicScript = Aref_Ruqaa({ weight: "400", subsets: ["arabic"], variable: "--font-ar-script", display: "swap", preload: false });

export const fontVariables = [arabic, english, englishDisplay, englishScript, arabicScript]
  .map((font) => font.variable)
  .join(" ");
