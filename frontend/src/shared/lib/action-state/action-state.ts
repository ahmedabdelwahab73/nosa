import type { ApiErrorCode } from "@nosa/contracts";

/** What happened, so the UI can show the matching translated success message. */
export type ActionEvent = "created" | "updated" | "deleted" | "saved" | "sent";

/**
 * The return type of every Server Action. Actions can't read the locale,
 * so they return codes; the client translates them (see useActionFeedback).
 */
export type ActionState<T = undefined> =
  | { ok: true; event: ActionEvent; data: T }
  | { ok: false; code: ApiErrorCode; fieldErrors?: Record<string, string[]> };

export const actionSuccess = <T = undefined>(event: ActionEvent, data?: T): ActionState<T> => ({
  ok: true,
  event,
  data: data as T,
});

export const actionFailure = (
  code: ApiErrorCode,
  fieldErrors?: Record<string, string[]>,
): ActionState<never> => ({ ok: false, code, fieldErrors });
