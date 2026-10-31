import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/checkout/components/order-confirmation";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Skeleton } from "@/shared/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.store.order.thanksTitle, robots: { index: false } };
}

export default function OrderRoute({ params }: PageProps<"/[locale]/order/[number]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-6 h-[32rem] w-full max-w-3xl rounded-2xl" />}>
      <OrderConfirmation params={params} />
    </Suspense>
  );
}
