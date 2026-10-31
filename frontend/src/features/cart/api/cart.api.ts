import "server-only";
import { CART_ID_HEADER, type AddCartItemInput, type CartDto } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Who owns the cart: the signed-in user (token) or the guest cookie id. Express prefers the user. */
export type CartContext = { token?: string; cartId?: string | null };

const options = ({ token, cartId }: CartContext) => ({ token, headers: cartId ? { [CART_ID_HEADER]: cartId } : undefined });

export const cartApi = {
  addItem: (ctx: CartContext, body: AddCartItemInput) => http<CartDto>("/cart/items", { method: "POST", body, ...options(ctx) }),
  updateItem: (ctx: CartContext, id: string, quantity: number) => http<CartDto>(`/cart/items/${id}`, { method: "PATCH", body: { quantity }, ...options(ctx) }),
  removeItem: (ctx: CartContext, id: string) => http<CartDto>(`/cart/items/${id}`, { method: "DELETE", ...options(ctx) }),
  applyCoupon: (ctx: CartContext, code: string) => http<CartDto>("/cart/coupon", { method: "POST", body: { code }, ...options(ctx) }),
  removeCoupon: (ctx: CartContext) => http<CartDto>("/cart/coupon", { method: "DELETE", ...options(ctx) }),
};
