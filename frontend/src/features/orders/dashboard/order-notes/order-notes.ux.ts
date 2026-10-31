"use client";

import { useState, useTransition } from "react";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { addOrderNote } from "./order-notes.action";

export function useOrderNotes(orderId: string, messages: FeedbackMessages) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  const add = () =>
    startTransition(async () => {
      const outcome = await addOrderNote(orderId, { note });
      setResult(outcome);
      if (outcome.ok) setNote("");
    });

  return { note, setNote, pending, add };
}
