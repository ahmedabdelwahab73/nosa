import "server-only";
import { cookies } from "next/headers";

const COOKIE = "nosa_last_order";

/** Lets the thank-you page show the order a guest just placed, without exposing it by number alone. */
export async function rememberLastOrder(number: string, phone: string) {
  (await cookies()).set(COOKIE, JSON.stringify({ number, phone }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function readLastOrder(): Promise<{ number: string; phone: string } | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as { number?: unknown; phone?: unknown };
    return typeof value.number === "string" && typeof value.phone === "string" ? { number: value.number, phone: value.phone } : null;
  } catch {
    return null;
  }
}
