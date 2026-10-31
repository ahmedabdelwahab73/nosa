import "server-only";
import { notFound } from "next/navigation";
import { getAccessToken } from "@/shared/lib/auth";
import { HttpError } from "@/shared/lib/api/http";
import { catalogDashboardApi } from "../../api/catalog.api";
import { draftFromProduct, emptyDraft } from "../lib/product-draft";

/** Categories for the picker plus the draft to edit (a blank one for a new product). Request-time. */
export async function getProductEditorData(productId: string | null) {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");

  try {
    const [categories, product] = await Promise.all([
      catalogDashboardApi.categories(token),
      productId ? catalogDashboardApi.product(token, productId) : null,
    ]);
    return { categories: categories.data, draft: product ? draftFromProduct(product.data) : emptyDraft() };
  } catch (error) {
    // A mistyped or deleted id is a 404 page, not a crash.
    if (error instanceof HttpError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}
