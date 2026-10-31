import { Suspense } from "react";
import type { Metadata } from "next";
import { CartPage } from "@/features/cart/components/cart-page";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Skeleton } from "@/shared/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.store.cart.title, robots: { index: false } };
}

export default function CartRoute() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-6 h-96 w-full max-w-7xl rounded-2xl" />}>
      <CartPage />
    </Suspense>
  );
}
