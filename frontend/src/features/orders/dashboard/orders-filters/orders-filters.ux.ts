"use client";

import { useUrlFilters } from "@/shared/hooks/use-url-filters";

export function useOrdersFilters() {
  const filters = useUrlFilters(["status", "paymentMethod"]);
  return {
    query: filters.query,
    status: filters.value("status"),
    paymentMethod: filters.value("paymentMethod"),
    hasFilters: filters.hasFilters,
    onQueryChange: filters.onQueryChange,
    onStatusChange: (status: string) => filters.onChange("status", status),
    onPaymentChange: (method: string) => filters.onChange("paymentMethod", method),
    clear: filters.clear,
  };
}
