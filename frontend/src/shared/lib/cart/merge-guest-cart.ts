import "server-only";
import { CART_ID_HEADER } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";
import { clearCartCookie, getCartId } from "./cart-cookie";

/**
 * After sign-in: moves what the visitor put in the cart as a guest into their account cart.
 * Never blocks the sign-in; a failure only means the guest cart stays where it was.
 */
export async function mergeGuestCart(accessToken: string) {
  const cartId = await getCartId();
  if (!cartId) return;

  try {
    await http("/cart/merge", { method: "POST", token: accessToken, headers: { [CART_ID_HEADER]: cartId } });
    await clearCartCookie();
  } catch (error) {
    console.error("Guest cart merge failed", error);
  }
}
