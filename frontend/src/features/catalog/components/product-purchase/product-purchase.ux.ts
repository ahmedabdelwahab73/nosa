"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { MAX_LINE_QUANTITY, type AddCartItemInput } from "@nosa/contracts";
import type { ActionState } from "@/shared/lib/action-state";
import {
  findVariant,
  initialSelection,
  isPurchasable,
  isSelectionComplete,
  isValueAvailable,
  maxQuantity,
  unitPrice,
  type PurchaseModel,
  type Selection,
} from "../../lib/product-selection";

type Options = {
  product: PurchaseModel;
  /** Server action from the cart feature, handed in by the route. */
  addToCart: (input: AddCartItemInput) => Promise<ActionState>;
  messages: { added: string; failed: string; chooseOptions: string; fillFields: string };
  onAdded?: () => void;
};

export function useProductPurchase({ product, addToCart, messages, onAdded }: Options) {
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const variant = useMemo(() => findVariant(product, selection), [product, selection]);
  const complete = isSelectionComplete(product, selection);
  const max = maxQuantity(product, variant);
  const surcharge = product.customization.enabled && Object.values(custom).some((value) => value.trim()) ? product.customization.extraPrice : 0;
  const missingRequired = product.customization.enabled && product.customization.fields.some((field) => field.required && !custom[field.key]?.trim());

  const submit = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (!complete) {
        toast.error(messages.chooseOptions);
        return resolve(false);
      }
      if (missingRequired) {
        toast.error(messages.fillFields);
        return resolve(false);
      }

      startTransition(async () => {
        const outcome = await addToCart({
          productId: product.id,
          sku: variant?.sku,
          quantity: Math.min(quantity, max),
          customization: Object.fromEntries(Object.entries(custom).filter(([, value]) => value.trim())),
        });
        if (outcome.ok) {
          toast.success(messages.added);
          onAdded?.();
        } else toast.error(messages.failed);
        resolve(outcome.ok);
      });
    });

  return {
    selection,
    quantity: Math.min(quantity, max),
    max,
    custom,
    pending,
    variant,
    complete,
    purchasable: isPurchasable(product, variant),
    price: unitPrice(product, variant),
    surcharge,
    select: (key: string, value: string) => setSelection((current) => ({ ...current, [key]: current[key] === value ? "" : value })),
    isAvailable: (key: string, value: string) => isValueAvailable(product, key, value, selection),
    setQuantity: (next: number) => setQuantity(Math.min(Math.max(1, next), max, MAX_LINE_QUANTITY)),
    setCustom: (key: string, value: string) => setCustom((current) => ({ ...current, [key]: value })),
    submit,
  };
}
