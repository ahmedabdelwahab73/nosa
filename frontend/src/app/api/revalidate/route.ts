import { revalidateTag } from "next/cache";
import { z } from "zod";
import { REVALIDATE_SECRET_HEADER } from "@nosa/contracts";
import { serverEnv } from "@/shared/config/env.server";

const bodySchema = z.object({ tags: z.array(z.string().min(1)).min(1) });

/** Called by the Express API after writes, with tags from CACHE_TAGS. */
export async function POST(request: Request) {
  if (request.headers.get(REVALIDATE_SECRET_HEADER) !== serverEnv.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ revalidated: false }, { status: 400 });
  }

  // Express calls this after the owner saves something: expire at once so the next visit (hers included) is fresh, never stale.
  for (const tag of parsed.data.tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, tags: parsed.data.tags });
}
