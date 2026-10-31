import type { Locale } from "@nosa/contracts";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import type { ProductFormApi } from "../product-form/product-form.ux";

/** What every section of the product form receives. */
export type SectionProps = {
  form: ProductFormApi;
  labels: Dictionary["dashboard"]["productForm"];
  locale: Locale;
};
