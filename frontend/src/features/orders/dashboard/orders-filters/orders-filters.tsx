"use client";

import { X } from "lucide-react";
import { ORDER_STATUSES, PAYMENT_METHODS } from "@nosa/contracts";
import { ALL } from "@/shared/hooks/use-url-filters";
import { ListSearch } from "@/shared/components/list-search";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useOrdersFilters } from "./orders-filters.ux";

type OrdersFiltersProps = {
  labels: Dictionary["dashboard"]["orders"];
  orderStatus: Dictionary["orderStatus"];
};

export function OrdersFilters({ labels, orderStatus }: OrdersFiltersProps) {
  const filters = useOrdersFilters();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ListSearch value={filters.query} onChange={filters.onQueryChange} placeholder={labels.search} className="sm:max-w-sm" />

      <Select value={filters.status} onValueChange={filters.onStatusChange}>
        <SelectTrigger className="h-10 w-44 rounded-full bg-card" aria-label={labels.columns.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{labels.allStatuses}</SelectItem>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {orderStatus[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.paymentMethod} onValueChange={filters.onPaymentChange}>
        <SelectTrigger className="h-10 w-48 rounded-full bg-card" aria-label={labels.columns.payment}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{labels.allPayments}</SelectItem>
          {PAYMENT_METHODS.map((method) => (
            <SelectItem key={method} value={method}>
              {labels.paymentMethod[method]}
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
