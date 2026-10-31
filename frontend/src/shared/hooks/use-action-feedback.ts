"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { ApiErrorCode } from "@nosa/contracts";
import type { ActionEvent, ActionState } from "@/shared/lib/action-state";

export type FeedbackMessages = {
  success: Record<ActionEvent, string>;
  errors: Record<ApiErrorCode, string>;
};

/**
 * Shows a toast for every Server Action result — success ("Added ✓") or failure with the reason.
 * No mutation in the app may finish silently. `messages` come translated from a Server parent
 * (`getFeedbackMessages()`), `state` from useActionState.
 */
export function useActionFeedback<T>(state: ActionState<T> | null, messages: FeedbackMessages) {
  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(messages.success[state.event]);
    else toast.error(messages.errors[state.code]);
  }, [state, messages]);
}
