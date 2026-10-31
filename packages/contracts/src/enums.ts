export const USER_ROLES = ["customer", "staff", "editor", "admin", "owner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Roles allowed into the dashboard at all; finer checks live per endpoint. */
export const DASHBOARD_ROLES = ["staff", "editor", "admin", "owner"] as const satisfies readonly UserRole[];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "in_production",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Only cash on delivery is live; the rest wait for the gateway decision. */
export const PAYMENT_METHODS = ["cod", "card", "wallet", "instapay"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "refunded", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const SHIPPING_PROVIDERS = ["flat_rate", "bosta"] as const;
export type ShippingProvider = (typeof SHIPPING_PROVIDERS)[number];

export const CURRENCY = "EGP";
