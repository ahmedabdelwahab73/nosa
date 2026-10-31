"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Locale, ProductFacetsDto } from "@nosa/contracts";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useShopFilters } from "./shop-filters.ux";

type ShopFiltersProps = {
  facets: ProductFacetsDto;
  locale: Locale;
  labels: Dictionary["store"]["shop"]["filters"];
  className?: string;
  /** Keeps checkbox ids unique when the filters render twice (sidebar and phone sheet). */
  idPrefix?: string;
};

const chip = "rounded-full border px-3 py-1.5 text-sm transition-colors";

/** The filter column: sizes, colors, price, availability. Every change is a new URL, rendered on the server. */
export function ShopFilters({ facets, locale, labels, className, idPrefix = "filters" }: ShopFiltersProps) {
  const filters = useShopFilters();

  return (
    <div className={cn("flex flex-col gap-5 transition-opacity", filters.pending && "opacity-60", className)}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-primary-800">
          <SlidersHorizontal className="size-4" aria-hidden />
          {labels.title}
        </h2>
        {filters.hasFilters && (
          <button type="button" onClick={filters.clearAll} className="text-sm text-primary-700 hover:underline">
            {labels.clear}
          </button>
        )}
      </div>

      {facets.sizes.length > 0 && (
        <fieldset className="stitch-soft flex flex-col gap-3 border-t pt-4">
          <legend className="sr-only">{labels.size}</legend>
          <h3 className="font-medium">{labels.size}</h3>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <button
                key={size.value}
                type="button"
                aria-pressed={filters.isOn("size", size.value)}
                onClick={() => filters.toggle("size", size.value)}
                className={cn(chip, filters.isOn("size", size.value) ? "border-primary-600 bg-primary-600 text-primary-foreground" : "bg-card hover:border-primary-300")}
              >
                {size.label[locale]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {facets.colors.length > 0 && (
        <fieldset className="stitch-soft flex flex-col gap-3 border-t pt-4">
          <legend className="sr-only">{labels.color}</legend>
          <h3 className="font-medium">{labels.color}</h3>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label[locale]}
                aria-label={color.label[locale]}
                aria-pressed={filters.isOn("color", color.value)}
                onClick={() => filters.toggle("color", color.value)}
                className={cn("size-8 rounded-full border-2 border-transparent ring-1 ring-black/10 transition-transform hover:scale-110", filters.isOn("color", color.value) && "border-primary-600 ring-2 ring-primary-300")}
                // The swatch color is data chosen in the dashboard.
                style={{ backgroundColor: color.hex ?? "transparent" }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {facets.price && (
        <fieldset className="stitch-soft flex flex-col gap-3 border-t pt-4">
          <legend className="sr-only">{labels.price}</legend>
          <h3 className="font-medium">{labels.price}</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              dir="ltr"
              aria-label={labels.min}
              placeholder={String(facets.price.min)}
              value={filters.min}
              onChange={(event) => filters.setMin(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && filters.applyPrice()}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              dir="ltr"
              aria-label={labels.max}
              placeholder={String(facets.price.max)}
              value={filters.max}
              onChange={(event) => filters.setMax(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && filters.applyPrice()}
            />
            <Button type="button" variant="outline" size="lg" className="h-10 px-4" onClick={filters.applyPrice}>
              {labels.apply}
            </Button>
          </div>
        </fieldset>
      )}

      <fieldset className="stitch-soft flex flex-col gap-3 border-t pt-4">
        <legend className="sr-only">{labels.availability}</legend>
        <h3 className="font-medium">{labels.availability}</h3>
        {(["inStock", "customizable"] as const).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox id={`${idPrefix}-${key}`} checked={filters.isOn(key, "true")} onCheckedChange={() => filters.toggle(key, "true")} />
            <Label htmlFor={`${idPrefix}-${key}`}>{labels[key]}</Label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
