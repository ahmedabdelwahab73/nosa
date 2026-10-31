"use client";

import { useState, useTransition } from "react";
import type { CouponDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { draftFromCoupon, toCouponInput } from "../../lib/coupon-draft";
import { deleteCoupon, saveCoupon } from "../coupon-dialog/coupon-dialog.action";

type DialogState = { open: boolean; coupon: CouponDto | null; key: number };

export function useCouponsTable(messages: FeedbackMessages) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, coupon: null, key: 0 });
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  return {
    dialog,
    pending,
    openDialog: (coupon: CouponDto | null) => setDialog((current) => ({ open: true, coupon, key: current.key + 1 })),
    setDialogOpen: (open: boolean) => setDialog((current) => ({ ...current, open })),
    toggleActive: (coupon: CouponDto) =>
      startTransition(async () => {
        setResult(await saveCoupon(coupon.id, toCouponInput({ ...draftFromCoupon(coupon), isActive: !coupon.isActive })));
      }),
    remove: (coupon: CouponDto) =>
      startTransition(async () => {
        setResult(await deleteCoupon(coupon.id));
      }),
  };
}
