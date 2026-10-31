"use server";

import { refresh } from "next/cache";
import { productInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/** Creates a product (`id` null) or updates one. Validated again here; Express validates and checks the role too. */
export async function saveProduct(id: string | null, input: unknown): Promise<ActionState<{ id: string }>> {
  if (id !== null && !OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");

    const { data } = id
      ? await catalogDashboardApi.updateProduct(token, id, parsed.data)
      : await catalogDashboardApi.createProduct(token, parsed.data);
    refresh();
    return actionSuccess(id ? "updated" : "created", { id: data.id });
  } catch (error) {
    return toActionFailure(error);
  }
}
