import { REVALIDATE_SECRET_HEADER } from "@nosa/contracts";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

/**
 * Tells the Next.js frontend that cached data changed.
 * Call it from services after a successful write, with tags from CACHE_TAGS.
 * Never throws: a failed revalidation must not fail the write itself.
 */
export async function revalidateFrontend(tags: string[]) {
  try {
    const res = await fetch(`${env.FRONTEND_URL}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", [REVALIDATE_SECRET_HEADER]: env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags }),
    });
    if (!res.ok) logger.warn({ tags, status: res.status }, "Frontend revalidation rejected");
  } catch (error) {
    logger.warn({ tags, error }, "Frontend revalidation failed");
  }
}
