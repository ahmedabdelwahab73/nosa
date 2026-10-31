import "server-only";
import { notFound } from "next/navigation";
import { getCategory, getProductFacets, listProducts } from "../../api/catalog.queries";
import { toApiQuery, type ShopQuery } from "../../lib/shop-query";

/** Everything the shop screen needs, read in parallel. An unknown category slug is a 404. */
export async function getShopData(query: ShopQuery, categorySlug?: string) {
  const [category, facets, list] = await Promise.all([
    categorySlug ? getCategory(categorySlug) : Promise.resolve(null),
    getProductFacets(categorySlug),
    listProducts(toApiQuery(query, categorySlug)),
  ]);
  if (categorySlug && !category) notFound();
  return { category, facets, list };
}
