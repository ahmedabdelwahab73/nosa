"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SEARCH_DELAY_MS = 350;
/** The "no filter" value of a select (Radix selects can't hold an empty string). */
export const ALL = "all";

/**
 * List filters that live in the URL (shareable, back button works, rendered on the server).
 * `keys` are the filter params; the text search is always `q` and is debounced.
 */
export function useUrlFilters(keys: readonly string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value && value !== ALL) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return {
    query,
    value: (key: string) => params.get(key) ?? ALL,
    hasFilters: ["q", ...keys].some((key) => params.has(key)),
    onQueryChange: (value: string) => {
      setQuery(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => update({ q: value.trim() || undefined }), SEARCH_DELAY_MS);
    },
    onChange: (key: string, value: string) => update({ [key]: value }),
    clear: () => {
      setQuery("");
      router.replace(pathname, { scroll: false });
    },
  };
}
