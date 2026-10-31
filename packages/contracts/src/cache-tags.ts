/**
 * Cache tags shared by both sides:
 * the frontend tags cached reads with them, and the backend sends them
 * to /api/revalidate whenever the matching data changes.
 */
export const CACHE_TAGS = {
  products: "products",
  product: (slug: string) => `product:${slug}`,
  categories: "categories",
  category: (slug: string) => `category:${slug}`,
  stories: "stories",
  cms: "cms",
  page: (slug: string) => `page:${slug}`,
  reviews: (productSlug: string) => `reviews:${productSlug}`,
  settings: "settings",
  shipping: "shipping",
} as const;

export const REVALIDATE_SECRET_HEADER = "x-revalidate-secret";
