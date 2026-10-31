"use server";

import { refresh } from "next/cache";
import { pageInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { cmsDashboardApi } from "../../api/cms.dashboard.api";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Creates a page or updates the one with the same slug. Express sanitises the HTML again. */
export async function savePage(isNew: boolean, input: unknown): Promise<ActionState> {
  const parsed = pageInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await cmsDashboardApi.savePage(token, parsed.data);
    refresh();
    return actionSuccess(isNew ? "created" : "updated");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function deletePage(slug: string): Promise<ActionState> {
  if (!SLUG.test(slug)) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await cmsDashboardApi.deletePage(token, slug);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}
