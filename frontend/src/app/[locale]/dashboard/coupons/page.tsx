import { Suspense } from "react";
import { CouponsPage } from "@/features/coupons/dashboard/coupons-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function CouponsRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <CouponsPage />
    </Suspense>
  );
}
