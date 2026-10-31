"use client";

import { useUrlFilters } from "@/shared/hooks/use-url-filters";

export function useCustomersSearch() {
  const filters = useUrlFilters([]);
  return { query: filters.query, onQueryChange: filters.onQueryChange };
}
