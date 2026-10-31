import { waitUntil } from "@vercel/functions";
import type { FilterQuery, SortOrder } from "mongoose";
import {
  CACHE_TAGS,
  type ImageAsset,
  type ProductCardDto,
  type ProductFacetsDto,
  type ProductInput,
  type ProductListQuery,
  type ProductSort,
  type ProductStatus,
} from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { buildMeta, toSkip } from "@/shared/http/pagination";
import { destroyAsset } from "@/shared/services/cloudinary.service";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { uniqueSlug } from "@/shared/utils/slug";
import { getCategoryWithDescendantIds } from "@/modules/categories/categories.service";
import { ProductModel, type Product, type ProductDocument } from "./products.model";

const CARD_FIELDS = "slug name images price salePrice rating customization.enabled inStock options category";

const SORTS: Record<ProductSort, Record<string, SortOrder>> = {
  newest: { createdAt: -1 },
  price_asc: { effectivePrice: 1, createdAt: -1 },
  price_desc: { effectivePrice: -1, createdAt: -1 },
  popular: { salesCount: -1, createdAt: -1 },
  rating: { "rating.average": -1, "rating.count": -1 },
};

type PopulatedCategory = { _id: unknown; slug: string; name: { ar: string; en: string } };

function toCard(doc: ProductDocument): ProductCardDto {
  const category = doc.category as unknown as PopulatedCategory;
  const colors = doc.options.find((o) => o.key === "color")?.values ?? [];
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name as ProductCardDto["name"],
    image: doc.images[0] ? (doc.images[0].toObject() as ImageAsset) : undefined,
    price: doc.price,
    salePrice: doc.salePrice ?? undefined,
    rating: { average: doc.rating?.average ?? 0, count: doc.rating?.count ?? 0 },
    isCustomizable: Boolean(doc.customization?.enabled),
    inStock: doc.inStock,
    colors: colors.map((c) => ({ value: c.value, hex: c.hex ?? undefined })),
    category: { id: String(category._id), slug: category.slug, name: category.name },
  };
}

function toDetail(doc: ProductDocument) {
  const { category: _category, ...json } = doc.toJSON() as Record<string, unknown>;
  return { ...json, ...toCard(doc) };
}

function revalidate(doc: Pick<Product, "slug"> & { category?: unknown }, ...extraSlugs: string[]) {
  const category = doc.category as PopulatedCategory | undefined;
  waitUntil(
    revalidateFrontend([
      CACHE_TAGS.products,
      CACHE_TAGS.product(doc.slug),
      ...extraSlugs.map(CACHE_TAGS.product),
      ...(category?.slug ? [CACHE_TAGS.category(category.slug)] : []),
    ]),
  );
}

// ── Storefront ─────────────────────────────────────────────────────────────

export async function listProducts(query: ProductListQuery) {
  const filter: FilterQuery<Product> = { status: "published" };

  if (query.category) filter.category = { $in: await getCategoryWithDescendantIds(query.category) };
  if (query.q) filter.$text = { $search: query.q };
  if (query.size) filter.filterSizes = query.size;
  if (query.color) filter.filterColors = query.color;
  if (query.inStock) filter.inStock = true;
  if (query.customizable) filter["customization.enabled"] = true;
  if (query.featured) filter.isFeatured = true;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.effectivePrice = {
      ...(query.minPrice !== undefined && { $gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { $lte: query.maxPrice }),
    };
  }

  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .select(CARD_FIELDS)
      .populate("category", "slug name")
      .sort(SORTS[query.sort])
      .skip(toSkip(query))
      .limit(query.limit),
    ProductModel.countDocuments(filter),
  ]);

  return { items: docs.map(toCard), meta: buildMeta(query, total) };
}

export async function getPublishedProduct(slug: string) {
  const doc = await ProductModel.findOne({ slug, status: "published" }).populate("category", "slug name");
  if (!doc) throw ApiError.notFound("Product");
  return toDetail(doc);
}

export async function listRelatedProducts(slug: string, limit = 8) {
  const product = await ProductModel.findOne({ slug, status: "published" }).select("category");
  if (!product) throw ApiError.notFound("Product");
  const docs = await ProductModel.find({ status: "published", category: product.category, _id: { $ne: product._id } })
    .select(CARD_FIELDS)
    .populate("category", "slug name")
    .sort({ salesCount: -1 })
    .limit(limit);
  return docs.map(toCard);
}

export async function hasProductsInCategory(categoryId: string) {
  return Boolean(await ProductModel.exists({ category: categoryId }));
}

// ── Dashboard ──────────────────────────────────────────────────────────────

type DashboardQuery = { page: number; limit: number; q?: string; status?: ProductStatus; category?: string };

export async function listProductsForDashboard({ q, status, category, ...page }: DashboardQuery) {
  const filter: FilterQuery<Product> = {
    ...(status && { status }),
    ...(category && { category }),
    ...(q && { $text: { $search: q } }),
  };
  // Stable order: sorting by updatedAt made a row jump to the top after every toggle.
  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .select(`${CARD_FIELDS} status stock variants isFeatured updatedAt`)
      .populate("category", "slug name")
      .sort({ createdAt: -1, _id: -1 })
      .skip(toSkip(page))
      .limit(page.limit),
    ProductModel.countDocuments(filter),
  ]);

  const items = docs.map((doc) => ({
    ...toCard(doc),
    status: doc.status,
    isFeatured: doc.isFeatured,
    totalStock: doc.variants.length ? doc.variants.reduce((sum, v) => sum + v.stock, 0) : doc.stock,
    updatedAt: (doc as unknown as { updatedAt: Date }).updatedAt,
  }));
  return { items, meta: buildMeta(page, total) };
}

export async function getProductById(id: string) {
  const doc = await ProductModel.findById(id).populate("category", "slug name");
  if (!doc) throw ApiError.notFound("Product");
  return { ...toDetail(doc), status: doc.status, categoryId: String((doc.category as unknown as PopulatedCategory)._id) };
}

export async function createProduct(input: ProductInput) {
  const doc = await ProductModel.create({
    ...input,
    slug: await uniqueSlug(ProductModel, input.slug ?? input.name.en),
  });
  await doc.populate("category", "slug name");
  revalidate(doc);
  return toDetail(doc);
}

export async function updateProduct(id: string, input: ProductInput) {
  const doc = await ProductModel.findById(id);
  if (!doc) throw ApiError.notFound("Product");

  const oldSlug = doc.slug;
  const removedImages = doc.images
    .map((image) => image.publicId)
    .filter((publicId) => !input.images.some((image) => image.publicId === publicId));

  doc.set(input);
  doc.slug = input.slug && input.slug !== oldSlug ? await uniqueSlug(ProductModel, input.slug, id) : oldSlug;
  await doc.save();
  await doc.populate("category", "slug name");

  waitUntil(Promise.all(removedImages.map(destroyAsset)));
  revalidate(doc, oldSlug);
  return toDetail(doc);
}

export async function duplicateProduct(id: string) {
  const source = await ProductModel.findById(id).lean();
  if (!source) throw ApiError.notFound("Product");

  const { _id, createdAt: _c, updatedAt: _u, ...data } = source as typeof source & { createdAt: Date; updatedAt: Date };
  const doc = await ProductModel.create({
    ...data,
    name: { ar: `${data.name.ar} (نسخة)`, en: `${data.name.en} (copy)` },
    slug: await uniqueSlug(ProductModel, `${data.slug}-copy`),
    status: "draft",
    variants: data.variants.map((v) => ({ ...v, sku: `${v.sku}-COPY` })),
    rating: { average: 0, count: 0 },
    salesCount: 0,
  });
  await doc.populate("category", "slug name");
  return toDetail(doc);
}

export async function setProductsStatus(ids: string[], status: ProductStatus) {
  const docs = await ProductModel.find({ _id: { $in: ids } }).select("slug");
  await ProductModel.updateMany({ _id: { $in: ids } }, { status });
  waitUntil(revalidateFrontend([CACHE_TAGS.products, ...docs.map((d) => CACHE_TAGS.product(d.slug))]));
  return { updated: docs.length };
}

export async function deleteProduct(id: string) {
  const doc = await ProductModel.findById(id).populate("category", "slug name");
  if (!doc) throw ApiError.notFound("Product");
  await doc.deleteOne();
  waitUntil(Promise.all(doc.images.map((image) => destroyAsset(image.publicId))));
  revalidate(doc);
}

/** Resolves a published product's id and slug (used by reviews and wishlist). */
export async function getPublishedProductRef(slugOrId: { slug?: string; id?: string }) {
  const doc = await ProductModel.findOne({ ...(slugOrId.slug ? { slug: slugOrId.slug } : { _id: slugOrId.id }), status: "published" }).select("slug");
  if (!doc) throw ApiError.notFound("Product");
  return { id: doc.id as string, slug: doc.slug };
}

export async function setProductRating(productId: string, rating: { average: number; count: number }) {
  const doc = await ProductModel.findByIdAndUpdate(productId, { rating }, { new: true }).select("slug");
  if (doc) waitUntil(revalidateFrontend([CACHE_TAGS.product(doc.slug), CACHE_TAGS.products]));
}

/** Cards for a list of ids, in the given order (wishlist). */
export async function listProductCardsByIds(ids: string[]) {
  const docs = await ProductModel.find({ _id: { $in: ids }, status: "published" }).select(CARD_FIELDS).populate("category", "slug name");
  const byId = new Map(docs.map((doc) => [doc.id as string, toCard(doc)]));
  return ids.map((id) => byId.get(id)).filter((card): card is ProductCardDto => Boolean(card));
}

/** In-stock (not made-to-order) products/variants at or below the threshold. */
export async function listLowStock(threshold: number, limit = 10) {
  const docs = await ProductModel.find({
    status: "published",
    $or: [
      { variants: { $size: 0 }, isMadeToOrder: false, stock: { $lte: threshold } },
      { variants: { $elemMatch: { isMadeToOrder: false, stock: { $lte: threshold } } } },
    ],
  })
    .select("slug name stock variants")
    .limit(limit);

  return docs.map((doc) => ({
    id: doc.id as string,
    slug: doc.slug,
    name: doc.name,
    items: doc.variants.length
      ? doc.variants.filter((v) => !v.isMadeToOrder && v.stock <= threshold).map((v) => ({ sku: v.sku, stock: v.stock }))
      : [{ sku: null, stock: doc.stock }],
  }));
}

/** Sizes, colors and the price range of the published products in a category: the options the shop filters show. */
export async function getProductFacets(categorySlug?: string): Promise<ProductFacetsDto> {
  const filter: FilterQuery<Product> = { status: "published" };
  if (categorySlug) filter.category = { $in: await getCategoryWithDescendantIds(categorySlug) };

  // Small catalogue: one capped read, merged in memory, is simpler than a multi-stage aggregation.
  const docs = await ProductModel.find(filter).select("options effectivePrice").limit(500).lean();
  const sizes = new Map<string, ProductFacetsDto["sizes"][number]>();
  const colors = new Map<string, ProductFacetsDto["colors"][number]>();
  let min = Infinity;
  let max = -Infinity;

  for (const doc of docs) {
    min = Math.min(min, doc.effectivePrice);
    max = Math.max(max, doc.effectivePrice);
    for (const option of doc.options) {
      for (const value of option.values) {
        const label = value.label as ProductFacetsDto["sizes"][number]["label"];
        if (option.key === "size" && !sizes.has(value.value)) sizes.set(value.value, { value: value.value, label });
        if (option.key === "color" && !colors.has(value.value)) colors.set(value.value, { value: value.value, label, hex: value.hex ?? undefined });
      }
    }
  }

  return {
    sizes: [...sizes.values()],
    colors: [...colors.values()],
    price: docs.length ? { min: Math.floor(min), max: Math.ceil(max) } : null,
  };
}
