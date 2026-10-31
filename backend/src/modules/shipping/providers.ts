import type { ShippingProvider as ProviderName } from "@nosa/contracts";

export type ShippingQuote = { fee: number; estimatedDays: { min: number; max: number } };

/** Every shipping company plugs in behind this interface (flat rate now, Bosta later). */
export interface ShippingProvider {
  readonly name: ProviderName;
  quote(input: { governorate: { fee: number; estimatedDays: { min: number; max: number } }; subtotal: number; freeShipping: boolean }): ShippingQuote;
}

export const flatRateProvider: ShippingProvider = {
  name: "flat_rate",
  quote: ({ governorate, freeShipping }) => ({
    fee: freeShipping ? 0 : governorate.fee,
    estimatedDays: governorate.estimatedDays,
  }),
};
