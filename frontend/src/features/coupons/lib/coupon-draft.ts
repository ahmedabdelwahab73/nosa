import type { CouponDto, CouponType } from "@nosa/contracts";

/** The form keeps everything as text, so a half-typed number never turns into NaN while the owner types. */
export type CouponDraft = {
  code: string;
  type: CouponType;
  value: string;
  minSubtotal: string;
  maxUses: string;
  perUserLimit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

export const emptyCouponDraft = (): CouponDraft => ({
  code: "",
  type: "percent",
  value: "",
  minSubtotal: "",
  maxUses: "",
  perUserLimit: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
});

const dateOnly = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

export const draftFromCoupon = (coupon: CouponDto): CouponDraft => ({
  code: coupon.code,
  type: coupon.type,
  value: String(coupon.value),
  minSubtotal: String(coupon.minSubtotal),
  maxUses: coupon.maxUses === null ? "" : String(coupon.maxUses),
  perUserLimit: coupon.perUserLimit === null ? "" : String(coupon.perUserLimit),
  startsAt: dateOnly(coupon.startsAt),
  endsAt: dateOnly(coupon.endsAt),
  isActive: coupon.isActive,
});

const numberOrNull = (text: string) => (text.trim() === "" ? null : Number(text));

/** What `couponInputSchema` expects. Free-shipping coupons carry no value; blank limits mean "no limit". */
export function toCouponInput(draft: CouponDraft) {
  return {
    code: draft.code,
    type: draft.type,
    value: draft.type === "free_shipping" ? 0 : Number(draft.value || 0),
    minSubtotal: Number(draft.minSubtotal || 0),
    maxUses: numberOrNull(draft.maxUses),
    perUserLimit: numberOrNull(draft.perUserLimit),
    startsAt: draft.startsAt || null,
    endsAt: draft.endsAt || null,
    isActive: draft.isActive,
  };
}
