import { Suspense } from "react";
import { SettingsPage } from "@/features/settings/dashboard/settings-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardSettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-2xl" />}>
      <SettingsPage />
    </Suspense>
  );
}
