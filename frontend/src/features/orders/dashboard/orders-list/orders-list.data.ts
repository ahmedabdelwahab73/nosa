import "server-only";
import { orderDashboardQuerySchema } from "@nosa/contracts";
import { getAccessToken } from "@/shared/lib/auth";
import { ordersDashboardApi } from "../../api/orders.api";

export const ORDERS_PAGE_SIZE = 20;

/** Bad or missing URL params fall back to the defaults instead of breaking the page. */
export function parseOrdersQuery(params: Record<string, string | string[] | undefined>) {
  const flat = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const parsed = orderDashboardQuerySchema.safeParse(flat);
  return parsed.success ? parsed.data : orderDashboardQuerySchema.parse({});
}

/** Request-time read: the owner must see new orders the moment they arrive. */
export async function listDashboardOrders(query: ReturnType<typeof parseOrdersQuery>) {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");

  const { page, status, paymentMethod, q } = query;
  const result = await ordersDashboardApi.list(token, { page, limit: ORDERS_PAGE_SIZE, status, paymentMethod, q });
  const meta = result.meta ?? { page: 1, limit: ORDERS_PAGE_SIZE, total: result.data.length, pages: 1 };
  return { items: result.data, meta };
}
