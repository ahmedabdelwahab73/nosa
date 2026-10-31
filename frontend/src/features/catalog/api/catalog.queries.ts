import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, type ProductListQuery } from "@nosa/contracts";
import { HttpError } from "@/shared/lib/api/http";
import { catalogApi } from "./catalog.api";

/**
 * Cached storefront reads. Freshness comes from tag revalidation (Express calls /api/revalidate after
 * every dashboard write), so the lifetimes are long.
 */

export async function getCategoryTree() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.categories);
  return (await catalogApi.categoryTree()).data;
}

/** null when the category doesn't exist (the page turns that into a 404). */
export async function getCategory(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.categories, CACHE_TAGS.category(slug));
  try {
    return (await catalogApi.category(slug)).data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}

type ListQuery = Partial<Record<keyof ProductListQuery, string | number | boolean>>;

export async function listProducts(query: ListQuery = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products);
  const { data, meta } = await catalogApi.products(query);
  return { items: data, meta: meta ?? { page: 1, limit: data.length, total: data.length, pages: 1 } };
}

/** null when the product doesn't exist or isn't published. */
export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.product(slug));
  try {
    return (await catalogApi.product(slug)).data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}

export async function listRelatedProducts(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.product(slug));
  return (await catalogApi.related(slug)).data;
}

/** Sizes, colors and the price range the shop filters offer for a category. */
export async function getProductFacets(category?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.products);
  return (await catalogApi.facets(category)).data;
}
