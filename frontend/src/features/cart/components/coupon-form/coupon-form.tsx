"use client";

import { Tag, X } from "lucide-react";
import type { CartDto } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { useCouponForm } from "./coupon-form.ux";

type CouponFormProps = {
  coupon: CartDto["coupon"];
  labels: Dictionary["store"]["cart"]["coupon"];
  messages: FeedbackMessages;
};

/** Enter a code, or see the one that is applied with a button to take it off. */
export function CouponForm({ coupon, labels, messages }: CouponFormProps) {
  const form = useCouponForm(messages);

  if (coupon) {
    return (
      <div className="stitch flex items-center justify-between gap-2 rounded-xl border bg-secondary/60 px-3 py-2 text-sm">
        <span className="flex items-center gap-2 text-primary-800">
          <Tag className="size-4" aria-hidden />
          {labels.applied.replace("{code}", coupon.code)}
          {coupon.freeShipping && <span className="text-muted-foreground">· {labels.freeShipping}</span>}
        </span>
        <Button type="button" variant="ghost" size="icon-sm" onClick={form.remove} disabled={form.pending} aria-label={labels.remove} title={labels.remove}>
          {form.pending ? <Spinner /> : <X />}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.apply} className="flex flex-col gap-2">
      <label htmlFor="coupon-code" className="text-sm font-medium">{labels.label}</label>
      <div className="flex gap-2">
        <Input id="coupon-code" dir="ltr" autoComplete="off" value={form.code} onChange={(event) => form.setCode(event.target.value.toUpperCase())} placeholder={labels.placeholder} />
        <Button type="submit" variant="outline" size="lg" className="h-10 px-4" disabled={form.pending || !form.code.trim()}>
          {form.pending && <Spinner />}
          {labels.apply}
        </Button>
      </div>
    </form>
  );
}
