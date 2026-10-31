"use client";

import * as m from "motion/react-m";
import { inViewOnce, variants } from "@/shared/lib/motion/presets";
import { cn } from "@/shared/lib/utils";

const paths = {
  wave: { viewBox: "0 0 600 60", d: "M2 40 C 80 5, 140 5, 200 32 S 330 58, 400 28 S 520 0, 598 22" },
  // A soft wave that loops into a small heart in the middle (under titles, in the header).
  heart: {
    viewBox: "0 0 240 40",
    d: "M2 30 C 40 34, 80 34, 112 28 C 104 18, 110 8, 118 14 L 120 16 L 122 14 C 130 8, 136 18, 128 28 C 160 34, 200 34, 238 26",
  },
} as const;

type ThreadLineProps = {
  className?: string;
  variant?: keyof typeof paths;
  /** Draws the thread in when it scrolls into view. */
  animated?: boolean;
};

/** The purple thread from the logo's needle, used to "sew" sections together. */
export function ThreadLine({ className, variant = "wave", animated = true }: ThreadLineProps) {
  const { viewBox, d } = paths[variant];
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden
      className={cn("h-auto w-full text-primary-400 rtl:-scale-x-100", className)}
    >
      <m.path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={variants.drawThread}
        initial={animated ? "hidden" : false}
        whileInView="visible"
        viewport={inViewOnce}
      />
    </svg>
  );
}
