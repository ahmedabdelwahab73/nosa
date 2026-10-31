"use client";

import { X } from "lucide-react";
import { PRODUCT_STATUSES, type Locale } from "@nosa/contracts";
import { ListSearch } from "@/shared/components/list-search";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { ALL, useProductsFilters } from "./products-filters.ux";

type ProductsFiltersProps = {
  locale: Locale;
  labels: Dictionary["dashboard"]["products"];
  categories: { id: string; name: { ar: string; en: string } }[];
};

export function ProductsFilters({ locale, labels, categories }: ProductsFiltersProps) {
  const filters = useProductsFilters();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ListSearch value={filters.query} onChange={filters.onQueryChange} placeholder={labels.search} className="sm:max-w-xs" />

      <Select value={filters.category} onValueChange={filters.onCategoryChange}>
        <SelectTrigger className="h-10 w-44 rounded-full bg-card" aria-label={labels.columns.category}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{labels.allCategories}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={filters.onStatusChange}>
        <SelectTrigger className="h-10 w-40 rounded-full bg-card" aria-label={labels.columns.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{labels.allStatuses}</SelectItem>
          {PRODUCT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {labels.status[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filters.hasFilters && (
        <Button variant="ghost" onClick={filters.clear}>
          <X />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
}
