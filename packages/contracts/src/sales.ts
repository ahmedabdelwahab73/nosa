import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_METHODS, type OrderStatus, type PaymentMethod, type PaymentStatus } from "./enums";
import type { LocalizedText } from "./i18n";
import type { ImageAsset } from "./media";
import { phoneSchema } from "./phone";

const money = z.number().nonnegative().multipleOf(0.01);

// ── Shipping ───────────────────────────────────────────────────────────────

export const shippingRateInputSchema = z.object({
  fee: money,
  estimatedDays: z.object({ min: z.number().int().min(0), max: z.number().int().min(0) }),
  isActive: z.boolean(),
});

export type GovernorateDto = {
  code: string;
  name: LocalizedText;
  fee: number;
  estimatedDays: { min: number; max: number };
  isActive: boolean;
};

// ── Coupons ────────────────────────────────────────────────────────────────

export const COUPON_TYPES = ["percent", "fixed", "free_shipping"] as const;
export type CouponType = (typeof COUPON_TYPES)[number];

export const couponInputSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9_-]{3,30}$/, "INVALID_CODE"),
    type: z.enum(COUPON_TYPES),
    value: money.default(0),
    minSubtotal: money.default(0),
    maxUses: z.number().int().positive().nullable().default(null),
    perUserLimit: z.number().int().positive().nullable().default(null),
    startsAt: z.coerce.date().nullable().default(null),
    endsAt: z.coerce.date().nullable().default(null),
    isActive: z.boolean().default(true),
  })
  .refine((c) => c.type !== "percent" || (c.value > 0 && c.value <= 100), { path: ["value"], message: "INVALID_PERCENT" })
  .refine((c) => c.type !== "fixed" || c.value > 0, { path: ["value"], message: "INVALID_VALUE" })
  .refine((c) => !c.startsAt || !c.endsAt || c.startsAt < c.endsAt, { path: ["endsAt"], message: "ENDS_BEFORE_START" });

export type CouponInput = z.infer<typeof couponInputSchema>;

// ── Cart ───────────────────────────────────────────────────────────────────

export const MAX_LINE_QUANTITY = 10;
export const CART_ID_HEADER = "x-cart-id";

export const addCartItemSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  /** Required when the product has variants. */
  sku: z.string().trim().min(1).optional(),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY).default(1),
  /** Values for the product's customization fields, keyed by field key. */
  customization: z.record(z.string(), z.string().trim().max(500)).default({}),
});

export type AddCartItemInput = z.input<typeof addCartItemSchema>;

export const updateCartItemSchema = z.object({ quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY) });
export const applyCouponSchema = z.object({ code: z.string().trim().min(1).max(30) });

export type CartLineDto = {
  id: string;
  productId: string;
  slug: string;
  name: LocalizedText;
  image?: ImageAsset;
  sku?: string;
  optionValues: Record<string, string>;
  optionLabels: LocalizedText[];
  customization: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** False when the product was unpublished or the stock no longer covers the quantity. */
  available: boolean;
  maxQuantity: number;
  isMadeToOrder: boolean;
};

export type CartDto = {
  id: string;
  items: CartLineDto[];
  itemCount: number;
  subtotal: number;
  discount: number;
  coupon: { code: string; type: CouponType; freeShipping: boolean } | null;
  /** Coupon present but no longer valid (expired, below minimum...). */
  couponError: string | null;
};

// ── Checkout & orders ──────────────────────────────────────────────────────

export const IDEMPOTENCY_HEADER = "idempotency-key";

export const checkoutSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(2).max(80),
    phone: phoneSchema,
    email: z.email().optional(),
  }),
  address: z.object({
    governorate: z.string().trim().min(1),
    city: z.string().trim().min(2).max(80),
    street: z.string().trim().min(3).max(200),
    building: z.string().trim().max(100).optional(),
    landmark: z.string().trim().max(200).optional(),
  }),
  paymentMethod: z.enum(PAYMENT_METHODS),
  notes: z.string().trim().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Which status may follow which. Cancelling/returning restores stock. */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_production", "ready", "cancelled"],
  in_production: ["ready", "cancelled"],
  ready: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().trim().max(500).optional(),
});

export const orderNoteSchema = z.object({ note: z.string().trim().min(1).max(1000) });

export const trackOrderSchema = z.object({ number: z.string().trim().min(5).max(30), phone: phoneSchema });

export const orderDashboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(ORDER_STATUSES).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  governorate: z.string().optional(),
  q: z.string().trim().max(50).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type OrderItemDto = {
  product: string;
  slug: string;
  name: LocalizedText;
  image?: ImageAsset;
  sku?: string;
  optionValues: Record<string, string>;
  optionLabels: LocalizedText[];
  customization: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isMadeToOrder: boolean;
};

export type OrderDto = {
  id: string;
  number: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string; note?: string }[];
  contact: CheckoutInput["contact"];
  address: CheckoutInput["address"] & { governorateName: LocalizedText };
  items: OrderItemDto[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  estimatedDays: { min: number; max: number };
  createdAt: string;
};

export type DashboardOrderListItem = {
  id: string;
  number: string;
  status: OrderStatus;
  customer: { name: string; phone: string };
  governorateName?: LocalizedText;
  itemCount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type DashboardOrderDto = OrderDto & {
  /** `by` is populated with the staff member's name. */
  internalNotes: { text: string; by?: { name?: string } | null; at: string }[];
  allowedNextStatuses: OrderStatus[];
};

export type CouponDto = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  maxUses: number | null;
  perUserLimit: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  usedCount: number;
  createdAt: string;
};
