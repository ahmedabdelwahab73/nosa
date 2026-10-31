import { connection } from "next/server";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { ProductForm } from "../product-form";
import { getProductEditorData } from "./product-editor.data";

type ProductEditorProps = {
  /** null opens a blank form for a new product. */
  productId: string | null;
};

export async function ProductEditor({ productId }: ProductEditorProps) {
  await connection();
  const [locale, dict, messages, { categories, draft }] = await Promise.all([
    getLocale(),
    getDictionary(),
    getFeedbackMessages(),
    getProductEditorData(productId),
  ]);

  return (
    <ProductForm
      // A different product (or "new") must start with fresh form state.
      key={productId ?? "new"}
      productId={productId}
      initial={draft}
      locale={locale}
      labels={dict.dashboard.productForm}
      statusLabels={dict.dashboard.products.status}
      uploaderLabels={dict.dashboard.imageUploader}
      messages={messages}
      categories={categories}
      listHref={`/${locale}/dashboard/products`}
    />
  );
}
