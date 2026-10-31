"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { applyCartCoupon, removeCartCoupon } from "../../actions/cart.action";

export function useCouponForm(messages: FeedbackMessages) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();
  useActionFeedback(result, messages);

  return {
    code,
    pending,
    setCode,
    apply: (event: FormEvent) => {
      event.preventDefault();
      if (!code.trim()) return;
      startTransition(async () => {
        const outcome = await applyCartCoupon(code);
        setResult(outcome);
        if (outcome.ok) setCode("");
      });
    },
    remove: () =>
      startTransition(async () => {
        setResult(await removeCartCoupon());
      }),
  };
}
