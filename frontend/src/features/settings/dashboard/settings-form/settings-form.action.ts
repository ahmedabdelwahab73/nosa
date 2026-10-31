"use server";

import { refresh } from "next/cache";
import { settingsInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { settingsDashboardApi } from "../../api/settings.api";

/** Saves the store settings. Admins and owners only; Express checks the role again. */
export async function saveSettings(input: unknown): Promise<ActionState> {
  const parsed = settingsInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await settingsDashboardApi.update(token, parsed.data);
    refresh();
    return actionSuccess("saved");
  } catch (error) {
    return toActionFailure(error);
  }
}
