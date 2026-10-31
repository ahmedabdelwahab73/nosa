"use client";

import { useActionState } from "react";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import { simulateSave } from "./feedback-demo.action";

export function useFeedbackDemo(messages: FeedbackMessages) {
  const [state, formAction, pending] = useActionState(simulateSave, null);
  useActionFeedback(state, messages);
  return { formAction, pending };
}
