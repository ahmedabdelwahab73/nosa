"use server";

import { refresh } from "next/cache";
import { couponInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { couponsDashboardApi } from "../../api/coupons.api";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

/** Adds a coupon (`id` null) or updates one. Express checks the role and the unique code again. */
export async function saveCoupon(id: string | null, input: unknown): Promise<ActionState> {
  if (id !== null && !OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  const parsed = couponInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    if (id) await couponsDashboardApi.update(token, id, parsed.data);
    else await couponsDashboardApi.create(token, parsed.data);
    refresh();
    return actionSuccess(id ? "updated" : "created");
  } catch (error) {
    return toActionFailure(error);
  }
}

/** A used coupon is only switched off (Express keeps it for order history); an unused one is removed. */
export async function deleteCoupon(id: string): Promise<ActionState> {
  if (!OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await couponsDashboardApi.remove(token, id);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}
