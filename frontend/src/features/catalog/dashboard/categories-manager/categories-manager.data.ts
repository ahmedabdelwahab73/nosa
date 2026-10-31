import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { catalogDashboardApi } from "../../api/catalog.api";

/** Request-time read of every category (active or not) for the dashboard. */
export async function listDashboardCategories() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return (await catalogDashboardApi.categories(token)).data;
}
