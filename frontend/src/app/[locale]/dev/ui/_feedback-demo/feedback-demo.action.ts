"use server";

import { actionFailure, actionSuccess, type ActionState } from "@/shared/lib/action-state";

/** Dev-only: simulates a dashboard save that succeeds or fails. */
export async function simulateSave(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return formData.get("outcome") === "fail" ? actionFailure("CONFLICT") : actionSuccess("created");
}
