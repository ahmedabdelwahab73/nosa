"use client";

import { useRouter } from "next/navigation";

/** Retrying means asking the server for a fresh render, then letting the boundary try its children again. */
export function useErrorFallback(reset: () => void) {
  const router = useRouter();
  return {
    retry: () => {
      router.refresh();
      reset();
    },
  };
}
