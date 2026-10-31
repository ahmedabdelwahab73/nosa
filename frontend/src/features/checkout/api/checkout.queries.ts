import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@nosa/contracts";
import { checkoutApi } from "./checkout.api";

/** Governorates with their shipping fee and delivery days; refreshed when the owner edits rates. */
export async function listGovernorates() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.shipping);
  return (await checkoutApi.governorates()).data.filter((governorate) => governorate.isActive);
}
