"use server";

import { refresh } from "next/cache";
import { MAX_LINE_QUANTITY, addCartItemSchema, applyCouponSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { ensureCartId } from "@/shared/lib/cart/cart-cookie";
import { cartApi, type CartContext } from "../api/cart.api";

/**
 * Every cart mutation lives here (add, quantity, remove, coupon), shared by the product page, the cart
 * page and the header. Express re-validates stock and prices; the browser never sends a price.
 */

const OBJECT_ID = /^[a-f\d]{24}$/i;

async function context(): Promise<CartContext> {
  const [token, cartId] = await Promise.all([getAccessToken(), ensureCartId()]);
  return { token: token ?? undefined, cartId };
}

export async function addToCart(input: unknown): Promise<ActionState> {
  const parsed = addCartItemSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    await cartApi.addItem(await context(), parsed.data);
    refresh();
    return actionSuccess("created");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function updateCartLine(lineId: string, quantity: number): Promise<ActionState> {
  if (!OBJECT_ID.test(lineId) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) return actionFailure("VALIDATION_ERROR");

  try {
    await cartApi.updateItem(await context(), lineId, quantity);
    refresh();
    return actionSuccess("updated");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function removeCartLine(lineId: string): Promise<ActionState> {
  if (!OBJECT_ID.test(lineId)) return actionFailure("VALIDATION_ERROR");

  try {
    await cartApi.removeItem(await context(), lineId);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function applyCartCoupon(code: string): Promise<ActionState> {
  const parsed = applyCouponSchema.safeParse({ code });
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    await cartApi.applyCoupon(await context(), parsed.data.code);
    refresh();
    return actionSuccess("saved");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function removeCartCoupon(): Promise<ActionState> {
  try {
    await cartApi.removeCoupon(await context());
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}
