"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DASHBOARD_ROLES, DEFAULT_LOCALE, isLocale, loginSchema, phoneCheckSchema, registerSchema, type Locale } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { authApi } from "@/shared/lib/auth/auth.api";
import { writeSessionCookies } from "@/shared/lib/auth";
import { mergeGuestCart } from "@/shared/lib/cart/merge-guest-cart";

export type LoginStep = { step: "login" | "register"; phone: string };
export type LoginState = ActionState<LoginStep | undefined>;

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "");

/** Only same-site paths under a locale, so ?next= can't send people to another site. */
function safeNext(next: string, locale: Locale) {
  return /^\/(ar|en)(\/|$)/.test(next) && !next.startsWith("//") ? next : `/${locale}`;
}

/**
 * One action drives the whole sign-in: "check" asks the API whether the number has an account,
 * then "login" or "register" finish it. Success redirects, so only steps and failures return.
 */
export async function submitAuth(_prev: LoginState | null, formData: FormData): Promise<LoginState> {
  const localeValue = field(formData, "locale");
  const locale = isLocale(localeValue) ? localeValue : DEFAULT_LOCALE;
  const intent = field(formData, "intent");

  try {
    if (intent === "check") {
      const parsed = phoneCheckSchema.safeParse({ phone: field(formData, "phone") });
      if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));
      const { data } = await authApi.checkPhone(parsed.data.phone);
      return actionSuccess("saved", { step: data.exists ? "login" : "register", phone: parsed.data.phone });
    }

    const parsed =
      intent === "register"
        ? registerSchema.safeParse({ name: field(formData, "name"), phone: field(formData, "phone"), password: field(formData, "password") })
        : loginSchema.safeParse({ phone: field(formData, "phone"), password: field(formData, "password") });
    if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

    const { data } =
      intent === "register"
        ? await authApi.register(parsed.data as Parameters<typeof authApi.register>[0])
        : await authApi.login(parsed.data);

    writeSessionCookies(await cookies(), data.tokens);
    // What she put in the cart before signing in moves into her account cart.
    await mergeGuestCart(data.tokens.accessToken);

    const isStaff = (DASHBOARD_ROLES as readonly string[]).includes(data.user.role);
    const next = field(formData, "next");
    redirect(next ? safeNext(next, locale) : isStaff ? `/${locale}/dashboard` : `/${locale}`);
  } catch (error) {
    // redirect() throws a control-flow error that Next must receive untouched.
    if (error instanceof Error && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    return toActionFailure(error);
  }
}
