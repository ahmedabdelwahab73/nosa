"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@nosa/contracts";

/**
 * Switches language on the page you are on. The current path is read when you click (not while rendering),
 * so the link needs no request-time data and the header can be prerendered.
 */
export function useLocaleLink(nextLocale: Locale) {
  const router = useRouter();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab clicks; the plain href below still points at that language's home.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const [, , ...rest] = window.location.pathname.split("/");
    router.push(`/${[nextLocale, ...rest].join("/")}${window.location.search}${window.location.hash}`);
  };
}
