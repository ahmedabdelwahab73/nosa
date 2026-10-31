"use client";

import { useUrlFilters } from "@/shared/hooks/use-url-filters";

export { ALL } from "@/shared/hooks/use-url-filters";

export function useProductsFilters() {
  const filters = useUrlFilters(["status", "category"]);
  return {
    query: filters.query,
    status: filters.value("status"),
    category: filters.value("category"),
    hasFilters: filters.hasFilters,
    onQueryChange: filters.onQueryChange,
    onStatusChange: (status: string) => filters.onChange("status", status),
    onCategoryChange: (category: string) => filters.onChange("category", category),
    clear: filters.clear,
  };
}
