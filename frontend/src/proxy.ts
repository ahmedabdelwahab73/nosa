import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE } from "@nosa/contracts";
import { localeRedirect, pathLocale, rememberLocale } from "@/shared/i18n/locale-proxy";
import { applySessionRefresh, protectedRouteRedirect, refreshSession } from "@/shared/lib/auth/auth-proxy";

export async function proxy(request: NextRequest) {
  const redirectToLocale = localeRedirect(request);
  if (redirectToLocale) return redirectToLocale;

  const session = await refreshSession(request);

  const loginRedirect = protectedRouteRedirect(request, pathLocale(request) ?? DEFAULT_LOCALE);
  if (loginRedirect) {
    applySessionRefresh(loginRedirect, session);
    return loginRedirect;
  }

  // Forward the (possibly refreshed) cookies to this render.
  const response = NextResponse.next({ request: { headers: request.headers } });
  applySessionRefresh(response, session);
  rememberLocale(request, response);
  return response;
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, icons...).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
