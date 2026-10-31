"use server";

import { refresh } from "next/cache";
import { bulkStatusSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

const OBJECT_ID = /^[a-f\d]{24}$/i;

async function staffToken() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return token;
}

/** Publish / draft / archive one or many products. Express re-checks the role. */
export async function setProductsStatus(ids: string[], status: string): Promise<ActionState> {
  const parsed = bulkStatusSchema.safeParse({ ids, status });
  if (!parsed.success) return actionFailure("VALIDATION_ERROR");
  try {
    await catalogDashboardApi.setStatus(await staffToken(), parsed.data.ids, parsed.data.status);
    refresh();
    return actionSuccess("updated");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function duplicateProduct(id: string): Promise<ActionState> {
  if (!OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  try {
    await catalogDashboardApi.duplicateProduct(await staffToken(), id);
    refresh();
    return actionSuccess("created");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function deleteProduct(id: string): Promise<ActionState> {
  if (!OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  try {
    await catalogDashboardApi.deleteProduct(await staffToken(), id);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}
