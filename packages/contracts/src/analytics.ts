import type { OrderStatus } from "./enums";
import type { LocalizedText } from "./i18n";
import type { DashboardOrderListItem } from "./sales";

/** What `GET /dashboard/analytics/overview?days=` returns; the dashboard home renders all of it. */
export type DashboardOverviewDto = {
  range: { days: number; from: string };
  revenue: number;
  orders: number;
  averageOrderValue: number;
  newCustomers: number;
  newCustomOrders: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  topProducts: { productId: string; slug: string; name: LocalizedText; quantity: number; revenue: number }[];
  lowStock: { id: string; slug: string; name: LocalizedText; items: { sku: string | null; stock: number }[] }[];
  recentOrders: DashboardOrderListItem[];
};
