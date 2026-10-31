import { MAX_LINE_QUANTITY, type ImageAsset, type LocalizedText } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { ProductModel, type ProductDocument } from "./products.model";

/**
 * The single place where a cart/order line gets its price, stock limit and validated customization.
 * Cart and checkout both use it, so prices are always computed on the server from current data.
 */
export type ResolvedLine = {
  productId: string;
  slug: string;
  name: LocalizedText;
  image?: ImageAsset;
  sku?: string;
  optionValues: Record<string, string>;
  /** The chosen option labels in option order ("6-12 months", "Red"), ready to display. */
  optionLabels: LocalizedText[];
  customization: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isMadeToOrder: boolean;
  maxQuantity: number;
  available: boolean;
};

const round = (value: number) => Math.round(value * 100) / 100;

/** Loads all products of a cart/order in one query. Unpublished products come back missing. */
export async function loadProductsForLines(productIds: string[]) {
  const docs = await ProductModel.find({ _id: { $in: productIds }, status: "published" });
  return new Map(docs.map((doc) => [doc.id as string, doc]));
}

export function validateCustomization(product: ProductDocument, values: Record<string, string>) {
  const clean = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim() !== ""));
  if (!product.customization?.enabled) {
    if (Object.keys(clean).length) throw new ApiError("VALIDATION_ERROR", "This product can't be customised", { "body.customization": ["NOT_CUSTOMIZABLE"] });
    return {};
  }

  const fields = new Map(product.customization.fields.map((field) => [field.key, field]));
  const errors: Record<string, string[]> = {};
  for (const key of Object.keys(clean)) if (!fields.has(key)) errors[`body.customization.${key}`] = ["UNKNOWN_FIELD"];
  for (const field of fields.values()) {
    const value = clean[field.key];
    if (field.required && !value) errors[`body.customization.${field.key}`] = ["REQUIRED"];
    if (value && field.maxLength && value.length > field.maxLength) errors[`body.customization.${field.key}`] = ["TOO_LONG"];
  }
  if (Object.keys(errors).length) throw new ApiError("VALIDATION_ERROR", "Invalid customization", errors);
  return clean;
}

export function resolveLine(
  product: ProductDocument,
  { sku, quantity, customization }: { sku?: string; quantity: number; customization: Record<string, string> },
): ResolvedLine {
  const variant = sku ? product.variants.find((v) => v.sku === sku) : undefined;
  if (product.variants.length && !variant) {
    throw new ApiError("VALIDATION_ERROR", "Please choose a size/color", { "body.sku": ["VARIANT_REQUIRED"] });
  }

  const isMadeToOrder = variant ? variant.isMadeToOrder : product.isMadeToOrder;
  const stock = variant ? variant.stock : product.stock;
  const maxQuantity = isMadeToOrder ? MAX_LINE_QUANTITY : Math.min(stock, MAX_LINE_QUANTITY);

  const hasCustomization = Object.keys(customization).length > 0;
  const base = variant?.price ?? product.effectivePrice;
  const unitPrice = round(base + (hasCustomization ? (product.customization?.extraPrice ?? 0) : 0));

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name as LocalizedText,
    image: product.images[0] ? (product.images[0].toObject() as ImageAsset) : undefined,
    sku: variant?.sku,
    optionValues: variant ? Object.fromEntries(variant.optionValues ?? new Map()) : {},
    optionLabels: variant
      ? product.options.flatMap((option) => {
          const chosen = option.values.find((value) => value.value === variant.optionValues?.get(option.key));
          return chosen ? [chosen.label as LocalizedText] : [];
        })
      : [],
    customization,
    quantity,
    unitPrice,
    lineTotal: round(unitPrice * quantity),
    isMadeToOrder,
    maxQuantity,
    available: maxQuantity > 0 && quantity <= maxQuantity,
  };
}

/**
 * Takes stock for in-stock lines with conditional atomic updates — two parallel checkouts can never
 * sell the same last piece. Made-to-order lines don't consume stock. Returns what was taken so it can
 * be restored if the order fails.
 */
export async function reserveStock(lines: { productId: string; sku?: string; quantity: number; isMadeToOrder: boolean }[]) {
  const taken: typeof lines = [];
  for (const line of lines) {
    if (line.isMadeToOrder) continue;
    const result = line.sku
      ? await ProductModel.updateOne(
          { _id: line.productId, variants: { $elemMatch: { sku: line.sku, stock: { $gte: line.quantity } } } },
          { $inc: { "variants.$.stock": -line.quantity } },
        )
      : await ProductModel.updateOne({ _id: line.productId, stock: { $gte: line.quantity } }, { $inc: { stock: -line.quantity } });

    if (result.modifiedCount === 0) {
      await restoreStock(taken);
      throw new ApiError("CONFLICT", "Some items are no longer in stock", { [`items.${line.sku ?? line.productId}`]: ["OUT_OF_STOCK"] });
    }
    taken.push(line);
  }
  await refreshStockFlags(taken.map((line) => line.productId));
  return taken;
}

export async function restoreStock(lines: { productId: string; sku?: string; quantity: number; isMadeToOrder: boolean }[]) {
  for (const line of lines) {
    if (line.isMadeToOrder) continue;
    if (line.sku) {
      await ProductModel.updateOne({ _id: line.productId, "variants.sku": line.sku }, { $inc: { "variants.$.stock": line.quantity } });
    } else {
      await ProductModel.updateOne({ _id: line.productId }, { $inc: { stock: line.quantity } });
    }
  }
  await refreshStockFlags(lines.map((line) => line.productId));
}

/** Re-saves products so the denormalised `inStock` flag follows the new stock. */
async function refreshStockFlags(productIds: string[]) {
  const docs = await ProductModel.find({ _id: { $in: [...new Set(productIds)] } });
  await Promise.all(docs.map((doc) => doc.save()));
}

export async function recordSales(lines: { productId: string; quantity: number }[]) {
  await ProductModel.bulkWrite(
    lines.map((line) => ({ updateOne: { filter: { _id: line.productId }, update: { $inc: { salesCount: line.quantity } } } })),
  );
}
