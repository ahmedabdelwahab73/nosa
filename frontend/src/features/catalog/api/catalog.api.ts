import "server-only";
import type {
  CategoryDto,
  CategoryInput,
  CategoryNode,
  DashboardProductListItem,
  ProductCardDto,
  ProductDto,
  ProductFacetsDto,
  ProductInput,
  ProductListQuery,
  ProductStatus,
} from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

type Query = Partial<Record<keyof ProductListQuery, string | number | boolean>>;

/** Storefront endpoints — public, safe to call from "use cache" functions. */
export const catalogApi = {
  categoryTree: () => http<CategoryNode[]>("/categories"),
  category: (slug: string) => http<CategoryDto>(`/categories/${encodeURIComponent(slug)}`),
  products: (query: Query = {}) => http<ProductCardDto[]>("/products", { query }),
  facets: (category?: string) => http<ProductFacetsDto>("/products/facets", { query: { category } }),
  product: (slug: string) => http<ProductDto>(`/products/${encodeURIComponent(slug)}`),
  related: (slug: string) => http<ProductCardDto[]>(`/products/${encodeURIComponent(slug)}/related`),
};

/** Dashboard endpoints — always pass the staff token. */
export const catalogDashboardApi = {
  categories: (token: string) => http<CategoryDto[]>("/dashboard/categories", { token }),
  createCategory: (token: string, body: CategoryInput) =>
    http<CategoryDto>("/dashboard/categories", { method: "POST", token, body }),
  updateCategory: (token: string, id: string, body: CategoryInput) =>
    http<CategoryDto>(`/dashboard/categories/${id}`, { method: "PUT", token, body }),
  deleteCategory: (token: string, id: string) =>
    http<{ ok: true }>(`/dashboard/categories/${id}`, { method: "DELETE", token }),
  reorderCategories: (token: string, ids: string[]) =>
    http<{ ok: true }>("/dashboard/categories/reorder", { method: "PUT", token, body: { ids } }),

  products: (token: string, query: { page?: number; limit?: number; q?: string; status?: ProductStatus; category?: string }) =>
    http<DashboardProductListItem[]>("/dashboard/products", {
      token,
      query,
    }),
  product: (token: string, id: string) => http<ProductDto & { status: ProductStatus; categoryId: string }>(`/dashboard/products/${id}`, { token }),
  createProduct: (token: string, body: ProductInput) =>
    http<ProductDto>("/dashboard/products", { method: "POST", token, body }),
  updateProduct: (token: string, id: string, body: ProductInput) =>
    http<ProductDto>(`/dashboard/products/${id}`, { method: "PUT", token, body }),
  duplicateProduct: (token: string, id: string) =>
    http<ProductDto>(`/dashboard/products/${id}/duplicate`, { method: "POST", token }),
  setStatus: (token: string, ids: string[], status: ProductStatus) =>
    http<{ updated: number }>("/dashboard/products/status", { method: "PATCH", token, body: { ids, status } }),
  deleteProduct: (token: string, id: string) =>
    http<{ ok: true }>(`/dashboard/products/${id}`, { method: "DELETE", token }),
};
