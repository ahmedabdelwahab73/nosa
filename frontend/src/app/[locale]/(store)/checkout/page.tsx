import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Skeleton } from "@/shared/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.store.checkout.title, robots: { index: false } };
}

export default function CheckoutRoute() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-6 h-[36rem] w-full max-w-7xl rounded-2xl" />}>
      <CheckoutPage />
    </Suspense>
  );
}
