import { PRODUCT_SORTS, type ProductSort } from "@nosa/contracts";

type RawParams = Record<string, string | string[] | undefined>;

/** Filters shown as chips and cleared together. `q` is the search page's own box, not a filter. */
export const SHOP_FILTER_KEYS = ["size", "color", "minPrice", "maxPrice", "inStock", "customizable"] as const;
export type ShopFilterKey = (typeof SHOP_FILTER_KEYS)[number];

const PAGE_SIZE = 12;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export type ShopQuery = {
  page: number;
  sort: ProductSort;
  q?: string;
  /** Only the filters that are really set, as the strings found in the URL. */
  filters: Partial<Record<ShopFilterKey, string>>;
};

/** Reads the URL into a clean query; anything unknown or malformed is ignored instead of failing the page. */
export function parseShopQuery(raw: RawParams): ShopQuery {
  const page = Number(first(raw.page));
  const sort = first(raw.sort);
  const q = first(raw.q)?.trim().slice(0, 100);

  const filters: ShopQuery["filters"] = {};
  for (const key of SHOP_FILTER_KEYS) {
    const value = first(raw[key]);
    if (!value) continue;
    if ((key === "minPrice" || key === "maxPrice") && !(Number(value) >= 0)) continue;
    if ((key === "inStock" || key === "customizable") && value !== "true") continue;
    filters[key] = value;
  }

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    sort: PRODUCT_SORTS.includes(sort as ProductSort) ? (sort as ProductSort) : "newest",
    ...(q && { q }),
    filters,
  };
}

/** Parameters for the products API. */
export function toApiQuery(query: ShopQuery, category?: string) {
  return { ...query.filters, ...(query.q && { q: query.q }), ...(category && { category }), page: query.page, sort: query.sort, limit: PAGE_SIZE };
}

/** A shop URL with the given params changed (undefined removes one); other params stay. */
export function shopHref(basePath: string, query: ShopQuery, change: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams();
  const current: Record<string, string | undefined> = { ...query.filters, q: query.q, sort: query.sort === "newest" ? undefined : query.sort, page: query.page > 1 ? String(query.page) : undefined };
  for (const [key, value] of Object.entries({ ...current, ...change })) if (value) params.set(key, value);
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}
