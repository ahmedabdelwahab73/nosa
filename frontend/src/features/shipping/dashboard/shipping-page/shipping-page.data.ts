import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { shippingDashboardApi } from "../../api/shipping.api";

/** Request-time read of every governorate, active or not. */
export async function listShippingRates() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return (await shippingDashboardApi.list(token)).data;
}
