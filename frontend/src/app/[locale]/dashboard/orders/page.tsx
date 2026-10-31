import { Suspense } from "react";
import { OrdersList } from "@/features/orders/dashboard/orders-list";
import { Skeleton } from "@/shared/ui/skeleton";

export default function OrdersPage({ searchParams }: PageProps<"/[locale]/dashboard/orders">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <OrdersList searchParams={searchParams} />
    </Suspense>
  );
}
