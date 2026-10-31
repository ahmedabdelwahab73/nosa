"use server";

import { refresh } from "next/cache";
import { actionFailure, actionSuccess, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/** A category that still has products can't be deleted: the API answers CONFLICT and the UI explains it. */
export async function deleteCategory(id: string): Promise<ActionState> {
  if (!OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await catalogDashboardApi.deleteCategory(token, id);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}

/** `ids` is the full list of categories in the new display order. */
export async function reorderCategories(ids: string[]): Promise<ActionState> {
  if (!ids.length || !ids.every((id) => OBJECT_ID.test(id))) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await catalogDashboardApi.reorderCategories(token, ids);
    refresh();
    return actionSuccess("updated");
  } catch (error) {
    return toActionFailure(error);
  }
}
