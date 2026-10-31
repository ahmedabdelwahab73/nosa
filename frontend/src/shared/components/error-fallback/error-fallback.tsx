"use client";

import { RotateCw } from "lucide-react";
import { Illustration } from "@/shared/components/illustration";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useErrorFallback } from "./error-fallback.ux";

export type ErrorFallbackLabels = { title: string; text: string; retry: string; requestId: string };

type ErrorFallbackProps = {
  labels: ErrorFallbackLabels;
  reset: () => void;
  /** Server-side error reference (Next's digest), shown so the owner can report it. */
  reference?: string;
  /** Smaller layout for one failed section instead of the whole page. */
  compact?: boolean;
};

export function ErrorFallback({ labels, reset, reference, compact }: ErrorFallbackProps) {
  const { retry } = useErrorFallback(reset);

  return (
    <div role="alert" className={cn("flex flex-col items-center gap-4 text-center", compact ? "rounded-2xl border bg-card p-6" : "mx-auto max-w-md px-4 py-16")}>
      <Illustration name="empty-cart" alt="" className={compact ? "w-28" : "w-48"} />
      <h2 className="font-display text-xl font-semibold text-primary-800">{labels.title}</h2>
      <p className="text-sm text-muted-foreground">{labels.text}</p>
      {reference && (
        <p className="text-xs text-muted-foreground">
          {labels.requestId}: <span dir="ltr" className="font-mono">{reference}</span>
        </p>
      )}
      <Button onClick={retry}>
        <RotateCw />
        {labels.retry}
      </Button>
    </div>
  );
}
