import type { OrderStatus } from "@nosa/contracts";

/** Chart colors per order status, as brand tokens (never raw hex). */
export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "var(--color-warning)",
  confirmed: "var(--color-primary-300)",
  in_production: "var(--color-primary-500)",
  ready: "var(--color-primary-700)",
  shipped: "var(--color-info)",
  delivered: "var(--color-success)",
  cancelled: "var(--color-yarn-500)",
  returned: "var(--color-ink-subtle)",
};

/** Same colors as classes, for legend dots (no inline styles). */
export const STATUS_DOT_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-warning",
  confirmed: "bg-primary-300",
  in_production: "bg-primary-500",
  ready: "bg-primary-700",
  shipped: "bg-info",
  delivered: "bg-success",
  cancelled: "bg-yarn-500",
  returned: "bg-ink-subtle",
};
