import { Suspense } from "react";
import { PermissionsMatrix } from "@/features/dashboard-shell/components/permissions-matrix";
import { TeamPage } from "@/features/team/dashboard/team-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardStaffPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <TeamPage />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <PermissionsMatrix />
      </Suspense>
    </div>
  );
}
