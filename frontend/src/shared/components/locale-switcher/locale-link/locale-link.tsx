"use client";

import type { Locale } from "@nosa/contracts";
import { cn } from "@/shared/lib/utils/cn";
import { useLocaleLink } from "./locale-link.ux";

type LocaleLinkProps = { nextLocale: Locale; label: string; className?: string };

export function LocaleLink({ nextLocale, label, className }: LocaleLinkProps) {
  const onClick = useLocaleLink(nextLocale);

  return (
    <a
      href={`/${nextLocale}`}
      hrefLang={nextLocale}
      onClick={onClick}
      className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary-300 hover:text-primary-700", className)}
    >
      {label}
    </a>
  );
}
