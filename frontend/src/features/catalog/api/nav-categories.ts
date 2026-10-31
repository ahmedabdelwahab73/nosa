import "server-only";
import type { Locale } from "@nosa/contracts";
import { getCategoryTree } from "./catalog.queries";

/** Top-level categories for the header and footer, in the owner's order and already in the visitor's language. */
export async function listNavCategories(locale: Locale, limit = 6) {
  const tree = await getCategoryTree();
  return tree.slice(0, limit).map((category) => ({ slug: category.slug, label: category.name[locale] }));
}
