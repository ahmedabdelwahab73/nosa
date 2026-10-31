import "server-only";
import { cookies } from "next/headers";

/** Guests keep their cart under a random id in this cookie; Express stores the cart against it. */
export const CART_COOKIE = "nosa_cart";
const MAX_AGE = 60 * 24 * 60 * 60;

export async function getCartId() {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

/** For Server Actions only: returns the guest cart id, creating the cookie on first use. */
export async function ensureCartId() {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(CART_COOKIE, id, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
  return id;
}

export async function clearCartCookie() {
  (await cookies()).set(CART_COOKIE, "", { path: "/", maxAge: 0 });
}
