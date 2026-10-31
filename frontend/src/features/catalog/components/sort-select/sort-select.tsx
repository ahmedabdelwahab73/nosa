"use client";

import { PRODUCT_SORTS, type ProductSort } from "@nosa/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useShopParams } from "../../lib/use-shop-params";

type SortSelectProps = {
  value: ProductSort;
  label: string;
  options: Record<ProductSort, string>;
};

export function SortSelect({ value, label, options }: SortSelectProps) {
  const params = useShopParams();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={(sort) => params.update({ sort: sort === "newest" ? null : sort })}>
        <SelectTrigger className="h-10 min-w-44 bg-card" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_SORTS.map((sort) => (
            <SelectItem key={sort} value={sort}>
              {options[sort]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
