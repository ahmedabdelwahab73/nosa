import { Suspense } from "react";
import { DashboardShell } from "@/features/dashboard-shell/components/dashboard-shell";
import { DashboardSkeleton } from "@/features/dashboard-shell/components/dashboard-skeleton";

export default function DashboardLayout({ children }: LayoutProps<"/[locale]/dashboard">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
