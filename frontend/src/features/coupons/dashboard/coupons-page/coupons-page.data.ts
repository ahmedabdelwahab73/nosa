import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { couponsDashboardApi } from "../../api/coupons.api";

/** Request-time read: new redemptions should show up in the counters straight away. */
export async function listCoupons() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return (await couponsDashboardApi.list(token)).data;
}
