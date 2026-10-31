import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, type PublicSettingsDto } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Store settings for header, footer and checkout. Cached; refreshed when the admin saves settings. */
export async function getPublicSettings(): Promise<PublicSettingsDto> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.settings);
  return (await http<PublicSettingsDto>("/settings")).data;
}
