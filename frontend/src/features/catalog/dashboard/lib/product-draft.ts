import type { ImageAsset, LocalizedText, ProductDto, ProductStatus } from "@nosa/contracts";

/**
 * What the product form edits. Numbers are strings while typing ("12." is a valid in-between value),
 * and the two option kinds (size, color) are separate lists. `toProductInput` converts it to the
 * shape the API's zod schema expects, so the same schema validates client and server.
 */
export type OptionValueDraft = { value: string; label: LocalizedText; hex: string };

export type VariantDraft = {
  sku: string;
  optionValues: Record<string, string>;
  price: string;
  stock: string;
  isMadeToOrder: boolean;
};

export type CustomFieldType = "text" | "date" | "color" | "image" | "note";

export type CustomFieldDraft = {
  key: string;
  label: LocalizedText;
  type: CustomFieldType;
  required: boolean;
  maxLength: string;
};

export type ProductDraft = {
  name: LocalizedText;
  description: LocalizedText;
  care: LocalizedText;
  slug: string;
  categoryId: string;
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  images: ImageAsset[];
  price: string;
  salePrice: string;
  sizes: OptionValueDraft[];
  colors: OptionValueDraft[];
  variants: VariantDraft[];
  stock: string;
  isMadeToOrder: boolean;
  productionDays: string;
  setItems: LocalizedText[];
  customization: { enabled: boolean; extraPrice: string; fields: CustomFieldDraft[] };
  seo: { title: LocalizedText; description: LocalizedText };
};

const empty = (): LocalizedText => ({ ar: "", en: "" });

export const emptyDraft = (): ProductDraft => ({
  name: empty(),
  description: empty(),
  care: empty(),
  slug: "",
  categoryId: "",
  tags: [],
  status: "draft",
  isFeatured: false,
  images: [],
  price: "",
  salePrice: "",
  sizes: [],
  colors: [],
  variants: [],
  stock: "0",
  isMadeToOrder: false,
  productionDays: "0",
  setItems: [],
  customization: { enabled: false, extraPrice: "0", fields: [] },
  seo: { title: empty(), description: empty() },
});

const text = (value: Partial<LocalizedText> | undefined): LocalizedText => ({ ar: value?.ar ?? "", en: value?.en ?? "" });
const str = (value: number | undefined) => (value === undefined ? "" : String(value));

type DashboardProduct = ProductDto & { status: ProductStatus; categoryId: string };

export function draftFromProduct(product: DashboardProduct): ProductDraft {
  const optionValues = (key: "size" | "color") =>
    (product.options.find((option) => option.key === key)?.values ?? []).map(({ value, label, hex }) => ({
      value,
      label: text(label),
      hex: hex ?? "#832f88",
    }));

  return {
    name: text(product.name),
    description: text(product.description),
    care: text(product.careInstructions),
    slug: product.slug,
    categoryId: product.categoryId,
    tags: product.tags,
    status: product.status,
    isFeatured: product.isFeatured,
    images: product.images,
    price: str(product.price),
    salePrice: str(product.salePrice),
    sizes: optionValues("size"),
    colors: optionValues("color"),
    variants: product.variants.map((variant) => ({
      sku: variant.sku,
      optionValues: variant.optionValues,
      price: str(variant.price),
      stock: String(variant.stock),
      isMadeToOrder: variant.isMadeToOrder,
    })),
    stock: String(product.stock),
    isMadeToOrder: product.isMadeToOrder,
    productionDays: String(product.productionDays),
    setItems: product.setItems.map(text),
    customization: {
      enabled: product.customization.enabled,
      extraPrice: String(product.customization.extraPrice),
      fields: product.customization.fields.map((field) => ({
        key: field.key,
        label: text(field.label),
        type: field.type,
        required: field.required,
        maxLength: str(field.maxLength),
      })),
    },
    seo: { title: text(product.seo?.title), description: text(product.seo?.description) },
  };
}

const number = (value: string) => (value.trim() === "" ? undefined : Number(value));
const filled = (value: Partial<LocalizedText>) => Boolean(value.ar?.trim() || value.en?.trim());
const partial = (value: LocalizedText) => ({
  ...(value.ar.trim() && { ar: value.ar.trim() }),
  ...(value.en.trim() && { en: value.en.trim() }),
});

/** Ready for `productInputSchema.safeParse` (and the API): empty optional parts are left out. */
export function toProductInput(draft: ProductDraft) {
  const option = (key: "size" | "color", name: LocalizedText, values: OptionValueDraft[]) => ({
    key,
    name,
    values: values.map(({ value, label, hex }) => ({ value, label, ...(key === "color" && { hex }) })),
  });

  return {
    name: draft.name,
    ...(draft.slug.trim() && { slug: draft.slug.trim() }),
    description: draft.description,
    ...(filled(draft.care) && { careInstructions: partial(draft.care) }),
    category: draft.categoryId,
    tags: draft.tags,
    status: draft.status,
    isFeatured: draft.isFeatured,
    images: draft.images,
    price: number(draft.price),
    salePrice: number(draft.salePrice),
    options: [
      ...(draft.sizes.length ? [option("size", { ar: "المقاس", en: "Size" }, draft.sizes)] : []),
      ...(draft.colors.length ? [option("color", { ar: "اللون", en: "Color" }, draft.colors)] : []),
    ],
    variants: draft.variants.map((variant) => ({
      sku: variant.sku,
      optionValues: variant.optionValues,
      price: number(variant.price),
      stock: number(variant.stock) ?? 0,
      isMadeToOrder: variant.isMadeToOrder,
    })),
    stock: number(draft.stock) ?? 0,
    isMadeToOrder: draft.isMadeToOrder,
    productionDays: number(draft.productionDays) ?? 0,
    setItems: draft.setItems,
    customization: {
      enabled: draft.customization.enabled,
      extraPrice: number(draft.customization.extraPrice) ?? 0,
      fields: draft.customization.fields.map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type,
        required: field.required,
        maxLength: number(field.maxLength),
      })),
    },
    ...((filled(draft.seo.title) || filled(draft.seo.description)) && {
      seo: {
        ...(filled(draft.seo.title) && { title: partial(draft.seo.title) }),
        ...(filled(draft.seo.description) && { description: partial(draft.seo.description) }),
      },
    }),
  };
}
