import Link from "next/link";
import { connection } from "next/server";
import { EmptyState } from "@/shared/components/empty-state";
import { OrderSummary } from "@/shared/components/order-summary";
import { PageHeader } from "@/shared/components/page-header";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { Button } from "@/shared/ui/button";
import { getCart } from "@/shared/lib/cart/get-cart";
import { CartLines } from "../cart-lines";
import { CouponForm } from "../coupon-form";

/** The cart page. It reads the visitor's cookies, so the route wraps it in <Suspense>. */
export async function CartPage() {
  await connection();
  const [locale, dict, messages, cart] = await Promise.all([getLocale(), getDictionary(), getFeedbackMessages(), getCart()]);
  const t = dict.store.cart;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          illustration="empty-cart"
          title={t.empty}
          description={t.emptyText}
          action={
            <Button asChild size="xl">
              <Link href={`/${locale}/shop`}>{t.continueShopping}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const blocked = cart.items.some((line) => !line.available);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
      <PageHeader title={t.title} subtitle={t.items.replace("{count}", String(cart.itemCount))} />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <CartLines lines={cart.items} locale={locale} labels={t} messages={messages} />
        <OrderSummary locale={locale} labels={t} subtotal={cart.subtotal} discount={cart.discount} shippingText={t.shippingNote}>
          <CouponForm coupon={cart.coupon} labels={t.coupon} messages={messages} />
          {blocked && <p className="text-sm text-yarn-500">{t.fixIssues}</p>}
          <Button asChild={!blocked} size="xl" className="w-full" disabled={blocked}>
            {blocked ? <span>{t.checkout}</span> : <Link href={`/${locale}/checkout`}>{t.checkout}</Link>}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href={`/${locale}/shop`}>{t.continueShopping}</Link>
          </Button>
        </OrderSummary>
      </div>
    </div>
  );
}
