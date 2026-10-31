import { Suspense } from "react";
import { OrderDetail } from "@/features/orders/dashboard/order-detail";
import { Skeleton } from "@/shared/ui/skeleton";

export default function OrderPage({ params }: PageProps<"/[locale]/dashboard/orders/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
