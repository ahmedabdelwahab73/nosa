"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SHOP_FILTER_KEYS } from "./shop-query";

/**
 * Reads and writes the shop URL (filters, sort). The page itself is rendered on the server, so every change
 * is just a new URL; going back or sharing the link keeps the same view.
 */
export function useShopParams() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(search.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  return {
    pending,
    get: (key: string) => search.get(key),
    update,
    clear: () => update(Object.fromEntries(SHOP_FILTER_KEYS.map((key) => [key, null]))),
    hasFilters: SHOP_FILTER_KEYS.some((key) => search.has(key)),
  };
}
