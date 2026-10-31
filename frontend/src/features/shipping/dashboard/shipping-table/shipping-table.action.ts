"use server";

import { refresh } from "next/cache";
import { shippingRateInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { shippingDashboardApi } from "../../api/shipping.api";

/** Saves one governorate: fee, delivery days and whether the shop delivers there. */
export async function saveShippingRate(code: string, input: unknown): Promise<ActionState> {
  const parsed = shippingRateInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));
  if (parsed.data.estimatedDays.min > parsed.data.estimatedDays.max) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await shippingDashboardApi.update(token, code, parsed.data);
    refresh();
    return actionSuccess("saved");
  } catch (error) {
    return toActionFailure(error);
  }
}
