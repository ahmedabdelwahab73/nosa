import "server-only";
import type { DashboardOverviewDto } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Dashboard endpoint — admin/owner only, so always pass the staff token. */
export const analyticsApi = {
  overview: (token: string, days: number) =>
    http<DashboardOverviewDto>("/dashboard/analytics/overview", { token, query: { days } }),
};
