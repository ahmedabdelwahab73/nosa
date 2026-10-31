"use client";

import { ListSearch } from "@/shared/components/list-search";
import { useCustomersSearch } from "./customers-search.ux";

export function CustomersSearch({ placeholder }: { placeholder: string }) {
  const search = useCustomersSearch();
  return <ListSearch value={search.query} onChange={search.onQueryChange} placeholder={placeholder} />;
}
