"use client";

import { useOptimistic, useState, useTransition } from "react";
import type { CartLineDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { removeCartLine, updateCartLine } from "../../actions/cart.action";

type Change = { type: "quantity"; id: string; quantity: number } | { type: "remove"; id: string };

/** Quantity and remove react instantly (optimistic); the server answer confirms or rolls it back. */
export function useCartLines(lines: CartLineDto[], messages: FeedbackMessages) {
  const [optimistic, applyChange] = useOptimistic(lines, (current, change: Change) =>
    change.type === "remove"
      ? current.filter((line) => line.id !== change.id)
      : current.map((line) => (line.id === change.id ? { ...line, quantity: change.quantity, lineTotal: line.unitPrice * change.quantity } : line)),
  );
  const [result, setResult] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();
  useActionFeedback(result, messages);

  const run = (change: Change, task: () => Promise<ActionState>) =>
    startTransition(async () => {
      applyChange(change);
      setResult(await task());
    });

  return {
    lines: optimistic,
    pending,
    setQuantity: (line: CartLineDto, quantity: number) => {
      if (quantity < 1 || quantity > line.maxQuantity) return;
      run({ type: "quantity", id: line.id, quantity }, () => updateCartLine(line.id, quantity));
    },
    remove: (line: CartLineDto) => run({ type: "remove", id: line.id }, () => removeCartLine(line.id)),
  };
}
