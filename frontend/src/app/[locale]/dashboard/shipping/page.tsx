import { Suspense } from "react";
import { ShippingPage } from "@/features/shipping/dashboard/shipping-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ShippingRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <ShippingPage />
    </Suspense>
  );
}
