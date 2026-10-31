import { REFRESH_TOKEN_TTL_DAYS, type AuthTokens } from "@nosa/contracts";

export const ACCESS_COOKIE = "nosa_at";
export const REFRESH_COOKIE = "nosa_rt";

type CookieWriter = {
  set(name: string, value: string, options: Record<string, unknown>): unknown;
};

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Same cookie options everywhere (Server Actions and proxy) — tokens never reach client JS. */
export function writeSessionCookies(store: CookieWriter, tokens: AuthTokens) {
  store.set(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: tokens.expiresIn });
  store.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 });
}

export function clearSessionCookies(store: CookieWriter) {
  store.set(ACCESS_COOKIE, "", { ...base, maxAge: 0 });
  store.set(REFRESH_COOKIE, "", { ...base, maxAge: 0 });
}

/** Reads `exp` from a JWT without verifying it (Express verifies). Used only to refresh early. */
export function tokenExpiresWithin(token: string | undefined, seconds: number) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp !== "number" || payload.exp * 1000 - Date.now() < seconds * 1000;
  } catch {
    return true;
  }
}
