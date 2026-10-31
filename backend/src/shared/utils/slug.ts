import type { Model } from "mongoose";

/** "Red & White Dress Set!" → "red-white-dress-set". Slugs are built from the English name. */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Appends -2, -3... until no other document uses the slug. */
export async function uniqueSlug(model: Model<any>, base: string, excludeId?: string) {
  const root = slugify(base) || "item";
  let candidate = root;
  for (let n = 2; ; n++) {
    const taken = await model.exists({ slug: candidate, ...(excludeId && { _id: { $ne: excludeId } }) });
    if (!taken) return candidate;
    candidate = `${root}-${n}`;
  }
}
