import "server-only";
import { cache } from "react";
import { CART_ID_HEADER, type CartDto } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";
import { getAccessToken } from "@/shared/lib/auth";
import { getCartId } from "./cart-cookie";

/**
 * The visitor's cart, read at request time (cookies), once per request. Shared because the header, the
 * cart page and checkout all show it.
 * null when they have neither a guest cookie nor an account, so a first visit costs no API call.
 */
export const getCart = cache(async (): Promise<CartDto | null> => {
  const [token, cartId] = await Promise.all([getAccessToken(), getCartId()]);
  if (!token && !cartId) return null;
  return (await http<CartDto>("/cart", { token: token ?? undefined, headers: cartId ? { [CART_ID_HEADER]: cartId } : undefined })).data;
});
