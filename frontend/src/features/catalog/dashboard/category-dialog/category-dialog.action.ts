"use server";

import { refresh } from "next/cache";
import { categoryInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/** Creates a category (`id` null) or updates one. Express validates and checks the role again. */
export async function saveCategory(id: string | null, input: unknown): Promise<ActionState> {
  if (id !== null && !OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");

  const parsed = categoryInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    if (id) await catalogDashboardApi.updateCategory(token, id, parsed.data);
    else await catalogDashboardApi.createCategory(token, parsed.data);
    refresh();
    return actionSuccess(id ? "updated" : "created");
  } catch (error) {
    return toActionFailure(error);
  }
}
