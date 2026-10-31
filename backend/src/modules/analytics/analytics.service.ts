import { countNewCustomOrders } from "@/modules/custom-orders/custom-orders.service";
import { getSalesStats, listRecentOrders } from "@/modules/orders/orders.service";
import { listLowStock } from "@/modules/products/products.service";
import { getSettings } from "@/modules/settings/settings.service";
import { countNewCustomers } from "@/modules/users/users.service";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Everything the dashboard overview needs, gathered in parallel from each module's service. */
export async function getOverview(days: number) {
  const from = new Date(Date.now() - days * DAY_MS);
  const settings = await getSettings();
  const [sales, newCustomers, lowStock, newCustomOrders, recentOrders] = await Promise.all([
    getSalesStats(from),
    countNewCustomers(from),
    listLowStock(settings.inventory.lowStockThreshold),
    countNewCustomOrders(),
    listRecentOrders(),
  ]);
  return { range: { days, from: from.toISOString() }, ...sales, newCustomers, lowStock, newCustomOrders, recentOrders };
}
