"use server";

import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, checkoutSchema, isLocale } from "@nosa/contracts";
import { actionFailure, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { clearCartCookie, getCartId } from "@/shared/lib/cart/cart-cookie";
import { checkoutApi } from "../../api/checkout.api";
import { rememberLastOrder } from "../../lib/last-order-cookie";

const KEY = /^[\w-]{16,64}$/;

/**
 * Places the order from the cart. The idempotency key comes from the form, so a double click or a retry
 * after a slow network never creates two orders. Success redirects to the thank-you page.
 */
export async function placeOrder(localeValue: string, idempotencyKey: string, input: unknown): Promise<ActionState> {
  const locale = isLocale(localeValue) ? localeValue : DEFAULT_LOCALE;
  if (!KEY.test(idempotencyKey)) return actionFailure("VALIDATION_ERROR");

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  let number: string;
  try {
    const [token, cartId] = await Promise.all([getAccessToken(), getCartId()]);
    const { data: order } = await checkoutApi.placeOrder({ token: token ?? undefined, cartId }, parsed.data, idempotencyKey);
    number = order.number;
    await rememberLastOrder(order.number, parsed.data.contact.phone);
    await clearCartCookie();
  } catch (error) {
    return toActionFailure(error);
  }

  // Outside the try: redirect() works by throwing.
  redirect(`/${locale}/order/${number}`);
}
