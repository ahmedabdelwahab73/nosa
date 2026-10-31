import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { analyticsApi } from "../../api/analytics.api";
import { fillDays } from "../../lib/fill-days";

export const OVERVIEW_RANGES = [7, 30, 90] as const;
export type OverviewRange = (typeof OVERVIEW_RANGES)[number];

export const parseRange = (value: string | undefined): OverviewRange =>
  OVERVIEW_RANGES.find((days) => String(days) === value) ?? 30;

/** Request-time read (never cached): the numbers must be the shop's current ones. */
export async function getDashboardOverview(days: OverviewRange) {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  const { data } = await analyticsApi.overview(token, days);
  return { ...data, revenueByDay: fillDays(days, data.revenueByDay) };
}
