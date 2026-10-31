"use client";

import { useState } from "react";

/** Which image is showing; wraps around at both ends. */
export function useProductGallery(count: number) {
  const [index, setIndex] = useState(0);
  const safe = count ? Math.min(index, count - 1) : 0;

  return {
    index: safe,
    select: setIndex,
    next: () => setIndex((safe + 1) % count),
    previous: () => setIndex((safe - 1 + count) % count),
  };
}
