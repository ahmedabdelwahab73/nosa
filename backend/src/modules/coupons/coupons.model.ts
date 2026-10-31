import { Schema, model, Types } from "mongoose";
import { COUPON_TYPES } from "@nosa/contracts";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: COUPON_TYPES, required: true },
    value: { type: Number, default: 0 },
    minSubtotal: { type: Number, default: 0 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CouponModel = model("Coupon", couponSchema);

/** One row per order that used a coupon — enforces per-customer limits (by phone, works for guests). */
const redemptionSchema = new Schema(
  {
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
    phone: { type: String, required: true },
    order: { type: Types.ObjectId, ref: "Order" },
  },
  { timestamps: true },
);
redemptionSchema.index({ coupon: 1, phone: 1 });

export const CouponRedemptionModel = model("CouponRedemption", redemptionSchema);
