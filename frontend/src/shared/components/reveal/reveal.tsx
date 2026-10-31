"use client";

import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { inViewOnce, variants, type RevealVariant } from "@/shared/lib/motion/presets";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
};

/**
 * Animates its children in when they scroll into view.
 * Server Components can wrap any content with it without becoming client components.
 */
export function Reveal({ children, variant = "fadeUp", delay = 0, className }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </m.div>
  );
}

type RevealGroupProps = {
  /** Each child animates in one after the other. */
  children: ReactNode[];
  variant?: RevealVariant;
  className?: string;
  itemClassName?: string;
};

export function RevealGroup({ children, variant = "fadeUp", className, itemClassName }: RevealGroupProps) {
  return (
    <m.div
      className={className}
      variants={variants.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {children.map((child, index) => (
        <m.div key={index} variants={variants[variant]} className={itemClassName}>
          {child}
        </m.div>
      ))}
    </m.div>
  );
}
