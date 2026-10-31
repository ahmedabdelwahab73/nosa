"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import { Logo } from "@/shared/components/logo";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";

export type NavLink = { href: string; label: string };

type MobileNavProps = {
  locale: Locale;
  links: NavLink[];
  labels: { menu: string; close: string; search: string; searchPlaceholder: string };
  /** Sheets use physical sides: the menu opens from the start edge (right in Arabic). */
  side: "left" | "right";
};

/** Phone menu: search box plus the same links as the desktop header. */
export function MobileNav({ locale, links, labels, side }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={labels.menu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="gap-6 p-5">
        <SheetTitle className="sr-only">{labels.menu}</SheetTitle>
        <SheetDescription className="sr-only">{labels.menu}</SheetDescription>
        <Logo href={`/${locale}`} className="h-16 self-start" />
        <form action={`/${locale}/search`} role="search" className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            name="q"
            type="search"
            placeholder={labels.searchPlaceholder}
            aria-label={labels.search}
            className="h-11 w-full rounded-full border bg-card ps-10 pe-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </form>
        <nav className="flex flex-col">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link href={link.href} className="border-b border-dashed py-3 text-base font-medium text-foreground hover:text-primary-700">
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
