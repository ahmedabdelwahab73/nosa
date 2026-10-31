import type { CouponInput, CouponType } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { CouponModel, CouponRedemptionModel } from "./coupons.model";

export type CouponReason =
  | "COUPON_NOT_FOUND"
  | "COUPON_INACTIVE"
  | "COUPON_NOT_STARTED"
  | "COUPON_EXPIRED"
  | "COUPON_MIN_SUBTOTAL"
  | "COUPON_USED_UP"
  | "COUPON_USER_LIMIT";

export type CouponEvaluation = {
  id: string;
  code: string;
  type: CouponType;
  discount: number;
  freeShipping: boolean;
};

const couponError = (reason: CouponReason) =>
  new ApiError("VALIDATION_ERROR", "Coupon can't be used", { "body.code": [reason] });

const round = (value: number) => Math.round(value * 100) / 100;

/** Checks a code against the cart subtotal (and the customer's phone, when known). Throws with a reason. */
export async function evaluateCoupon(code: string, { subtotal, phone }: { subtotal: number; phone?: string }): Promise<CouponEvaluation> {
  const coupon = await CouponModel.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) throw couponError("COUPON_NOT_FOUND");
  if (!coupon.isActive) throw couponError("COUPON_INACTIVE");

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw couponError("COUPON_NOT_STARTED");
  if (coupon.endsAt && coupon.endsAt < now) throw couponError("COUPON_EXPIRED");
  if (subtotal < coupon.minSubtotal) throw couponError("COUPON_MIN_SUBTOTAL");
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) throw couponError("COUPON_USED_UP");

  if (phone && coupon.perUserLimit != null) {
    const used = await CouponRedemptionModel.countDocuments({ coupon: coupon._id, phone });
    if (used >= coupon.perUserLimit) throw couponError("COUPON_USER_LIMIT");
  }

  const discount =
    coupon.type === "percent" ? round((subtotal * coupon.value) / 100) : coupon.type === "fixed" ? Math.min(coupon.value, subtotal) : 0;

  return { id: coupon.id, code: coupon.code, type: coupon.type, discount, freeShipping: coupon.type === "free_shipping" };
}

/** Atomically takes one use (never more than maxUses, even with parallel checkouts). */
export async function redeemCoupon(couponId: string, phone: string) {
  const updated = await CouponModel.findOneAndUpdate(
    { _id: couponId, isActive: true, $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }] },
    { $inc: { usedCount: 1 } },
  );
  if (!updated) throw couponError("COUPON_USED_UP");
  return CouponRedemptionModel.create({ coupon: couponId, phone });
}

export async function attachRedemptionToOrder(redemptionId: string, orderId: string) {
  await CouponRedemptionModel.updateOne({ _id: redemptionId }, { order: orderId });
}

/** Gives the use back (failed checkout). */
export async function releaseCoupon(couponId: string, redemptionId: string) {
  await Promise.all([
    CouponModel.updateOne({ _id: couponId, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } }),
    CouponRedemptionModel.deleteOne({ _id: redemptionId }),
  ]);
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function listCoupons() {
  const docs = await CouponModel.find().sort({ createdAt: -1 });
  return docs.map((doc) => doc.toJSON());
}

export async function createCoupon(input: CouponInput) {
  return (await CouponModel.create(input)).toJSON();
}

export async function updateCoupon(id: string, input: CouponInput) {
  const doc = await CouponModel.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
  if (!doc) throw ApiError.notFound("Coupon");
  return doc.toJSON();
}

export async function deleteCoupon(id: string) {
  const doc = await CouponModel.findById(id);
  if (!doc) throw ApiError.notFound("Coupon");
  // Used coupons are kept for order history; they are deactivated instead.
  if (doc.usedCount > 0) {
    doc.isActive = false;
    await doc.save();
    return { deactivated: true };
  }
  await doc.deleteOne();
  return { deleted: true };
}
