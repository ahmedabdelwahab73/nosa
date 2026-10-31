import { z } from "zod";
import { localizedTextSchema, type LocalizedText } from "./i18n";
import { imageSchema, type ImageAsset } from "./media";

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const CUSTOMIZATION_FIELD_TYPES = ["text", "date", "color", "image", "note"] as const;

export const PRODUCT_SORTS = ["newest", "price_asc", "price_desc", "popular", "rating"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

const money = z.number().nonnegative().multipleOf(0.01);
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "INVALID_SLUG");

export const seoSchema = z.object({
  title: localizedTextSchema.partial().optional(),
  description: localizedTextSchema.partial().optional(),
});

// ── Categories ─────────────────────────────────────────────────────────────

export const categoryInputSchema = z.object({
  name: localizedTextSchema,
  slug: slug.optional(),
  description: localizedTextSchema.partial().optional(),
  image: imageSchema.optional(),
  parent: z.string().nullish(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  seo: seoSchema.optional(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export type CategoryDto = {
  id: string;
  name: LocalizedText;
  slug: string;
  description?: Partial<LocalizedText>;
  image?: ImageAsset;
  parent: string | null;
  order: number;
  isActive: boolean;
  seo?: z.infer<typeof seoSchema>;
};

export type CategoryNode = CategoryDto & { children: CategoryNode[] };

// ── Products ───────────────────────────────────────────────────────────────

export const productOptionSchema = z.object({
  key: z.enum(["size", "color"]),
  name: localizedTextSchema,
  values: z
    .array(
      z.object({
        value: z.string().trim().min(1),
        label: localizedTextSchema,
        /** Swatch color for color options. */
        hex: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      }),
    )
    .min(1),
});

export const productVariantSchema = z.object({
  sku: z.string().trim().min(1).max(64),
  /** e.g. { size: "6-12m", color: "red" } — keys must exist in options. */
  optionValues: z.record(z.string(), z.string()),
  price: money.optional(),
  stock: z.number().int().min(0).default(0),
  isMadeToOrder: z.boolean().default(false),
});

export const customizationFieldSchema = z.object({
  key: z.string().trim().regex(/^[a-z][a-z0-9_]*$/),
  label: localizedTextSchema,
  type: z.enum(CUSTOMIZATION_FIELD_TYPES),
  required: z.boolean().default(false),
  maxLength: z.number().int().positive().max(500).optional(),
});

export const productInputSchema = z
  .object({
    name: localizedTextSchema,
    slug: slug.optional(),
    description: localizedTextSchema,
    careInstructions: localizedTextSchema.partial().optional(),
    category: z.string().min(1),
    tags: z.array(z.string().trim().min(1)).default([]),
    status: z.enum(PRODUCT_STATUSES).default("draft"),
    isFeatured: z.boolean().default(false),
    images: z.array(imageSchema).max(12).default([]),
    price: money,
    salePrice: money.optional(),
    options: z.array(productOptionSchema).max(2).default([]),
    variants: z.array(productVariantSchema).default([]),
    /** Used only when the product has no variants. */
    stock: z.number().int().min(0).default(0),
    isMadeToOrder: z.boolean().default(false),
    productionDays: z.number().int().min(0).max(60).default(0),
    setItems: z.array(localizedTextSchema).default([]),
    customization: z
      .object({
        enabled: z.boolean().default(false),
        fields: z.array(customizationFieldSchema).max(10).default([]),
        extraPrice: money.default(0),
      })
      .default({ enabled: false, fields: [], extraPrice: 0 }),
    seo: seoSchema.optional(),
  })
  .refine((p) => p.salePrice === undefined || p.salePrice < p.price, {
    path: ["salePrice"],
    message: "SALE_PRICE_NOT_LOWER",
  })
  .refine((p) => new Set(p.variants.map((v) => v.sku)).size === p.variants.length, {
    path: ["variants"],
    message: "DUPLICATE_SKU",
  })
  .refine(
    (p) => {
      const allowed = new Map(p.options.map((o) => [o.key, new Set(o.values.map((v) => v.value))]));
      return p.variants.every((v) =>
        Object.entries(v.optionValues).every(([key, value]) => allowed.get(key as "size" | "color")?.has(value)),
      );
    },
    { path: ["variants"], message: "UNKNOWN_OPTION_VALUE" },
  );

export const productDashboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(100).optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  category: z.string().optional(),
});

export const bulkStatusSchema = z.object({
  ids: z.array(z.string().regex(/^[a-f\d]{24}$/i)).min(1).max(200),
  status: z.enum(PRODUCT_STATUSES),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  category: z.string().optional(),
  q: z.string().trim().max(100).optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStock: z.stringbool().optional(),
  customizable: z.stringbool().optional(),
  featured: z.stringbool().optional(),
  sort: z.enum(PRODUCT_SORTS).default("newest"),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

/** Lightweight shape for grids and cards. */
export type ProductCardDto = {
  id: string;
  slug: string;
  name: LocalizedText;
  image?: ImageAsset;
  price: number;
  salePrice?: number;
  rating: { average: number; count: number };
  isCustomizable: boolean;
  inStock: boolean;
  colors: { value: string; hex?: string }[];
  category: { id: string; slug: string; name: LocalizedText };
};

export type ProductDto = ProductCardDto &
  Omit<ProductInput, "category" | "slug" | "name" | "price" | "salePrice"> & {
    createdAt: string;
    updatedAt: string;
  };

/** One row of the dashboard products table. */
export type DashboardProductListItem = ProductCardDto & {
  status: ProductStatus;
  totalStock: number;
  isFeatured: boolean;
};

/** What the shop filters can offer for a category (or the whole shop). */
export type ProductFacetsDto = {
  sizes: { value: string; label: LocalizedText }[];
  colors: { value: string; label: LocalizedText; hex?: string }[];
  price: { min: number; max: number } | null;
};
