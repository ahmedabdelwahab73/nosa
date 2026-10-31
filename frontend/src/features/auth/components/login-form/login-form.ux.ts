"use client";

import { useActionState, useState, type FormEvent } from "react";
import { phoneSchema } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import { submitAuth, type LoginStep } from "./login-form.action";

export function useLoginForm(messages: FeedbackMessages) {
  const [state, formAction, pending] = useActionState(submitAuth, null);
  const [localPhoneError, setLocalPhoneError] = useState<string | null>(null);
  // The step comes back from the server, but "change number" must be able to reset it locally.
  const [dismissedState, setDismissedState] = useState<typeof state>(null);

  // Steps are not results to announce; only failures get a toast (success redirects away).
  useActionFeedback(state?.ok ? null : state, messages);

  const step: LoginStep | null = state?.ok && state !== dismissedState ? (state.data ?? null) : null;

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  // Same zod schema as the server, so a typo is caught before any request.
  function validatePhone(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    if (data.get("intent") !== "check") return;
    const result = phoneSchema.safeParse(String(data.get("phone") ?? ""));
    if (result.success) return setLocalPhoneError(null);
    event.preventDefault();
    setLocalPhoneError("INVALID_PHONE");
  }

  return {
    formAction,
    pending,
    step,
    phoneError: localPhoneError ?? fieldErrors?.phone?.[0] ?? null,
    nameError: fieldErrors?.name?.[0] ?? null,
    passwordError: fieldErrors?.password?.[0] ?? null,
    validatePhone,
    changeNumber: () => {
      setDismissedState(state);
      setLocalPhoneError(null);
    },
  };
}
