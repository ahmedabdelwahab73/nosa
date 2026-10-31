import Link from "next/link";
import type { Locale } from "@nosa/contracts";
import { cn } from "@/shared/lib/utils";

type ContentTabsProps = {
  locale: Locale;
  active: "home" | "pages";
  labels: { home: string; pages: string };
};

/** Content has two screens (the home page and the info pages), so a link-tab bar sits above each. */
export function ContentTabs({ locale, active, labels }: ContentTabsProps) {
  const tabs = [
    { key: "home", href: `/${locale}/dashboard/content`, label: labels.home },
    { key: "pages", href: `/${locale}/dashboard/content/pages`, label: labels.pages },
  ] as const;

  return (
    <nav className="flex gap-2 border-b" aria-label="content">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            tab.key === active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
