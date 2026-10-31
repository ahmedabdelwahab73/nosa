import type { OptionValueDraft, VariantDraft } from "./product-draft";

/** "6-12m" → "6-12m", "Red Rose" → "red-rose": a safe key for option values and SKUs. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** SKU like NS-6-12M-RED; an unknown prefix falls back to NS. */
const skuFor = (prefix: string, values: string[]) => [prefix || "NS", ...values].join("-").toUpperCase();

/**
 * Every size × color combination. Combinations that already exist keep their SKU, price and stock,
 * so adding a color never wipes what was typed for the others.
 */
export function generateVariants(
  sizes: OptionValueDraft[],
  colors: OptionValueDraft[],
  existing: VariantDraft[],
  skuPrefix: string,
): VariantDraft[] {
  const sizeAxis = sizes.length ? sizes.map((s) => ({ key: "size", value: s.value })) : [null];
  const colorAxis = colors.length ? colors.map((c) => ({ key: "color", value: c.value })) : [null];
  if (!sizes.length && !colors.length) return [];

  const signature = (optionValues: Record<string, string>) => JSON.stringify(Object.entries(optionValues).sort());
  const known = new Map(existing.map((variant) => [signature(variant.optionValues), variant]));

  return sizeAxis.flatMap((size) =>
    colorAxis.map((color) => {
      const optionValues = Object.fromEntries([size, color].filter((axis) => axis !== null).map((axis) => [axis.key, axis.value]));
      return (
        known.get(signature(optionValues)) ?? {
          sku: skuFor(skuPrefix, Object.values(optionValues)),
          optionValues,
          price: "",
          stock: "0",
          isMadeToOrder: false,
        }
      );
    }),
  );
}
