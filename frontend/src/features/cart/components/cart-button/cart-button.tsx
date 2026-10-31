import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import { getLocale } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { getCart } from "@/shared/lib/cart/get-cart";

type CartLinkProps = { locale: Locale; label: string; count?: number };

/** The bag icon with its item count. Static, so it can also be the loading fallback. */
export function CartLink({ locale, label, count = 0 }: CartLinkProps) {
  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href={`/${locale}/cart`} aria-label={count ? `${label} (${count})` : label}>
        <ShoppingBag />
        {count > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-yarn-500 px-1 text-[0.7rem] font-semibold leading-4.5 text-white">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}

/** Reads the cart at request time, so the layout wraps it in <Suspense> with a plain CartLink as fallback. */
export async function CartButton({ label }: { label: string }) {
  const [locale, cart] = await Promise.all([getLocale(), getCart().catch(() => null)]);
  return <CartLink locale={locale} label={label} count={cart?.itemCount} />;
}
