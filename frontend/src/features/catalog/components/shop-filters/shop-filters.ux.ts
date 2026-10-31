"use client";

import { useState } from "react";
import { useShopParams } from "../../lib/use-shop-params";

/** Filter state for the sidebar: chips and checkboxes apply at once, the price range on "Apply". */
export function useShopFilters() {
  const params = useShopParams();
  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");

  return {
    ...params,
    min,
    max,
    setMin,
    setMax,
    isOn: (key: string, value: string) => params.get(key) === value,
    /** Selecting the active chip again removes the filter. */
    toggle: (key: string, value: string) => params.update({ [key]: params.get(key) === value ? null : value }),
    applyPrice: () => params.update({ minPrice: min || null, maxPrice: max || null }),
    clearAll: () => {
      setMin("");
      setMax("");
      params.clear();
    },
  };
}
