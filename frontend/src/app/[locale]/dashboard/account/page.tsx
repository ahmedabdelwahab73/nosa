import { Suspense } from "react";
import { AccountPage } from "@/features/dashboard-shell/components/account-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardAccountPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-xl rounded-2xl" />}>
      <AccountPage />
    </Suspense>
  );
}
