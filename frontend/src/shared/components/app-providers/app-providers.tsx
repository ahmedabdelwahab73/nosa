"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { Direction } from "radix-ui";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/sonner";

type AppProvidersProps = {
  dir: "rtl" | "ltr";
  children: ReactNode;
};

/**
 * Client-side context every page needs: text direction for Radix, tooltips, toasts and animations.
 * LazyMotion + `m` components keep Motion's bundle small; `strict` forbids the heavy `motion.*` components.
 * MotionConfig follows the visitor's "reduce motion" OS setting.
 */
export function AppProviders({ dir, children }: AppProvidersProps) {
  return (
    <Direction.Provider dir={dir}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <TooltipProvider>
            {children}
            <Toaster theme="light" position={dir === "rtl" ? "top-left" : "top-right"} richColors />
          </TooltipProvider>
        </MotionConfig>
      </LazyMotion>
    </Direction.Provider>
  );
}
