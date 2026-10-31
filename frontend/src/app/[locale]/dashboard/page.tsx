import { Suspense } from "react";
import { DashboardOverview } from "@/features/analytics/components/dashboard-overview";
import { DashboardHome } from "@/features/dashboard-shell/components/dashboard-home";

// This page only decides where to send the signed-in role (redirects at request time), so it is not prerenderable.
export const instant = false;

export default function DashboardPage({ searchParams }: PageProps<"/[locale]/dashboard">) {
  return (
    <Suspense>
      <DashboardHome overview={<DashboardOverview searchParams={searchParams} />} />
    </Suspense>
  );
}
