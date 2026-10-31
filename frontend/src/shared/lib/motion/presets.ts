import type { Transition, Variants } from "motion/react";

/** Same curve as the `ease-thread` CSS token. */
export const EASE_THREAD = [0.65, 0, 0.35, 1] as const;

export const transitions = {
  base: { duration: 0.6, ease: EASE_THREAD },
  quick: { duration: 0.3, ease: EASE_THREAD },
  thread: { duration: 1.4, ease: EASE_THREAD },
} satisfies Record<string, Transition>;

/** The only animation variants in the app — reuse these instead of inline values. */
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: transitions.base },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transitions.base },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: transitions.base },
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  },
  drawThread: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: transitions.thread },
  },
} satisfies Record<string, Variants>;

export type RevealVariant = keyof Omit<typeof variants, "stagger" | "drawThread">;

/** Shared viewport settings: animate once, a little before the element is fully visible. */
export const inViewOnce = { once: true, amount: 0.25 } as const;
