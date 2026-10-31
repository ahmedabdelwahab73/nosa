"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Locale, ProductFacetsDto } from "@nosa/contracts";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { ShopFilters } from "../shop-filters";

type ShopFiltersSheetProps = {
  facets: ProductFacetsDto;
  locale: Locale;
  labels: Dictionary["store"]["shop"]["filters"];
};

/** Phones: the same filters in a bottom sheet behind one button. */
export function ShopFiltersSheet({ facets, locale, labels }: ShopFiltersSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="h-10 px-4 lg:hidden">
          <SlidersHorizontal />
          {labels.open}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-4 overflow-y-auto rounded-t-3xl p-5">
        <SheetTitle className="sr-only">{labels.title}</SheetTitle>
        <SheetDescription className="sr-only">{labels.title}</SheetDescription>
        <ShopFilters facets={facets} locale={locale} labels={labels} idPrefix="sheet-filters" />
        <SheetClose asChild>
          <Button size="xl" className="w-full">
            {labels.apply}
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
