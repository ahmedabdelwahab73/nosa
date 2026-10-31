import "server-only";
import type { DashboardOrderDto, DashboardOrderListItem, OrderStatus } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

type ListQuery = { page?: number; limit?: number; status?: string; paymentMethod?: string; q?: string; from?: string; to?: string };

/** Dashboard order endpoints (every dashboard role; Express checks the token on each call). */
export const ordersDashboardApi = {
  list: (token: string, query: ListQuery) => http<DashboardOrderListItem[]>("/dashboard/orders", { token, query }),
  detail: (token: string, id: string) => http<DashboardOrderDto>(`/dashboard/orders/${id}`, { token }),
  setStatus: (token: string, id: string, status: OrderStatus, note?: string) =>
    http<DashboardOrderDto>(`/dashboard/orders/${id}/status`, { method: "PATCH", token, body: { status, note } }),
  addNote: (token: string, id: string, note: string) =>
    http<DashboardOrderDto>(`/dashboard/orders/${id}/notes`, { method: "POST", token, body: { note } }),
};
