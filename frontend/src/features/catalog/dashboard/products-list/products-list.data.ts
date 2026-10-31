import "server-only";
import { productDashboardQuerySchema } from "@nosa/contracts";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

export const PRODUCTS_PAGE_SIZE = 20;

/** Bad or missing URL params fall back to the defaults instead of breaking the page. */
export function parseProductsQuery(params: Record<string, string | string[] | undefined>) {
  const flat = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const parsed = productDashboardQuerySchema.safeParse(flat);
  return parsed.success ? parsed.data : productDashboardQuerySchema.parse({});
}

/** Request-time read: the table must show what the shop has right now. */
export async function listDashboardProducts(query: ReturnType<typeof parseProductsQuery>) {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");

  const [products, categories] = await Promise.all([
    catalogDashboardApi.products(token, { ...query, limit: PRODUCTS_PAGE_SIZE }),
    catalogDashboardApi.categories(token),
  ]);
  // Lists always carry meta; the fallback only keeps the types honest.
  const meta = products.meta ?? { page: 1, limit: PRODUCTS_PAGE_SIZE, total: products.data.length, pages: 1 };
  return { items: products.data, meta, categories: categories.data };
}
