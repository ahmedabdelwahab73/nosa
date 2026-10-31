import { MAX_LINE_QUANTITY, type ProductDto } from "@nosa/contracts";

/** What the purchase panel needs from a product (kept small: it is sent to the browser). */
export type PurchaseModel = Pick<ProductDto, "id" | "slug" | "price" | "salePrice" | "options" | "variants" | "stock" | "isMadeToOrder" | "productionDays" | "customization">;

/** Chosen value per option key, e.g. { size: "0-3m", color: "red" }. */
export type Selection = Record<string, string>;

export type Variant = PurchaseModel["variants"][number];

export function findVariant(product: PurchaseModel, selection: Selection): Variant | undefined {
  if (!product.variants.length) return undefined;
  return product.variants.find((variant) => product.options.every((option) => variant.optionValues[option.key] === selection[option.key]));
}

const buyable = (variant: Variant) => variant.isMadeToOrder || variant.stock > 0;

/** A value is offered only if some buyable variant has it together with what is already chosen. */
export function isValueAvailable(product: PurchaseModel, key: string, value: string, selection: Selection) {
  if (!product.variants.length) return true;
  return product.variants.some(
    (variant) =>
      buyable(variant) &&
      variant.optionValues[key] === value &&
      product.options.every((option) => option.key === key || !selection[option.key] || variant.optionValues[option.key] === selection[option.key]),
  );
}

export const isSelectionComplete = (product: PurchaseModel, selection: Selection) => product.options.every((option) => selection[option.key]);

/** Price of one piece before the customisation surcharge. A variant price replaces the sale price. */
export function unitPrice(product: PurchaseModel, variant?: Variant) {
  return variant?.price ?? product.salePrice ?? product.price;
}

export function isPurchasable(product: PurchaseModel, variant?: Variant) {
  if (product.variants.length) return Boolean(variant && buyable(variant));
  return product.isMadeToOrder || product.stock > 0;
}

export function maxQuantity(product: PurchaseModel, variant?: Variant) {
  const madeToOrder = variant ? variant.isMadeToOrder : product.isMadeToOrder;
  const stock = variant ? variant.stock : product.stock;
  return madeToOrder ? MAX_LINE_QUANTITY : Math.max(1, Math.min(stock, MAX_LINE_QUANTITY));
}

/** Options with a single value start selected, so nobody has to tap the only choice. */
export function initialSelection(product: PurchaseModel): Selection {
  return Object.fromEntries(product.options.filter((option) => option.values.length === 1).map((option) => [option.key, option.values[0]!.value]));
}
