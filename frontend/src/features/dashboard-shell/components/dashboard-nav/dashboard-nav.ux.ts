"use client";

import { usePathname } from "next/navigation";

export function useDashboardNav(basePath: string) {
  const pathname = usePathname();

  // The overview lives at the base path itself, so it matches exactly; everything else by prefix.
  const isActive = (href: string) => (href === basePath ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return { isActive };
}
