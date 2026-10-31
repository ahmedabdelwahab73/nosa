import "server-only";
import { cacheLife } from "next/cache";

/** The date is read inside a cached scope so the footer can be prerendered. */
export async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
