"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@nosa/contracts";
import { authApi } from "@/shared/lib/auth/auth.api";
import { REFRESH_COOKIE, clearSessionCookies } from "@/shared/lib/auth/cookies";

/** Revokes the refresh token on the API (best effort), clears the cookies and returns to the login page. */
export async function logout(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;

  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    try {
      await authApi.logout(refreshToken);
    } catch (error) {
      // The cookies are cleared either way; the token expires on its own if the API is unreachable.
      console.error("Logout request failed", error);
    }
  }
  clearSessionCookies(store);
  redirect(`/${locale}/login`);
}
