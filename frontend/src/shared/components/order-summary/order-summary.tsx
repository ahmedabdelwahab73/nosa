import type { ReactNode } from "react";
import type { Locale } from "@nosa/contracts";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatPrice } from "@/shared/lib/format";

type OrderSummaryProps = {
  locale: Locale;
  labels: Pick<Dictionary["store"]["cart"], "summary" | "subtotal" | "discount" | "shipping" | "total">;
  subtotal: number;
  discount: number;
  /** A number once the governorate is known (checkout); omitted in the cart. */
  shipping?: number;
  /** Text shown where the shipping fee will appear ("calculated at checkout", "free"). */
  shippingText?: string;
  /** Coupon form, checkout button... placed under the totals. */
  children?: ReactNode;
};

/** The totals card shared by the cart and checkout pages. */
export function OrderSummary({ locale, labels, subtotal, discount, shipping, shippingText, children }: OrderSummaryProps) {
  const total = Math.max(0, subtotal - discount) + (shipping ?? 0);

  return (
    <section className="stitch-soft flex h-fit flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card">
      <h2 className="font-display text-xl font-semibold text-primary-800">{labels.summary}</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{labels.subtotal}</dt>
          <dd>{formatPrice(subtotal, locale)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>{labels.discount}</dt>
            <dd>−{formatPrice(discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{labels.shipping}</dt>
          <dd className="text-end">{shipping !== undefined && !shippingText ? formatPrice(shipping, locale) : shippingText}</dd>
        </div>
        <div className="mt-1 flex justify-between border-t border-dashed pt-3 text-base font-semibold">
          <dt>{labels.total}</dt>
          <dd>{formatPrice(total, locale)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
