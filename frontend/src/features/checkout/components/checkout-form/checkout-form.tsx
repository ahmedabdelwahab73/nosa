"use client";

import { Banknote } from "lucide-react";
import type { CartLineDto, GovernorateDto, Locale, PaymentMethod } from "@nosa/contracts";
import { OrderSummary } from "@/shared/components/order-summary";
import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/shared/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Textarea } from "@/shared/ui/textarea";
import type { CheckoutDraft } from "../../lib/checkout-draft";
import { useCheckoutForm } from "./checkout-form.ux";

type CheckoutFormProps = {
  locale: Locale;
  initial: CheckoutDraft;
  governorates: GovernorateDto[];
  lines: Pick<CartLineDto, "id" | "name" | "quantity" | "lineTotal">[];
  subtotal: number;
  discount: number;
  freeShipping: boolean;
  paymentMethods: PaymentMethod[];
  labels: Dictionary["store"]["checkout"];
  cartLabels: Dictionary["store"]["cart"];
  messages: FeedbackMessages;
};

export function CheckoutForm({ locale, initial, governorates, lines, subtotal, discount, freeShipping, paymentMethods, labels, cartLabels, messages }: CheckoutFormProps) {
  const form = useCheckoutForm({ locale, initial, governorates, freeShipping, messages, errorLabels: labels.errors, invalidMessage: labels.invalid });
  const { draft, set, error } = form;
  const delivery = form.governorate?.estimatedDays;

  return (
    <form onSubmit={form.submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card">
          <legend className="sr-only">{labels.contact}</legend>
          <h2 className="font-display text-xl font-semibold text-primary-800">{labels.contact}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={labels.name} required autoComplete="name" value={draft.name} onValueChange={(value) => set("name", value)} error={error("contact.name")} />
            <TextField label={labels.phone} required dir="ltr" inputMode="tel" autoComplete="tel" placeholder="01012345678" value={draft.phone} onValueChange={(value) => set("phone", value)} error={error("contact.phone")} />
          </div>
          <TextField label={labels.email} dir="ltr" type="email" autoComplete="email" value={draft.email} onValueChange={(value) => set("email", value)} error={error("contact.email")} />
        </fieldset>

        <fieldset className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card">
          <legend className="sr-only">{labels.address}</legend>
          <h2 className="font-display text-xl font-semibold text-primary-800">{labels.address}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!error("address.governorate")}>
              <FieldLabel>
                {labels.governorate}
                <span className="text-destructive"> *</span>
              </FieldLabel>
              <Select value={draft.governorate} onValueChange={(value) => set("governorate", value)}>
                <SelectTrigger className="w-full bg-card" aria-invalid={!!error("address.governorate")}>
                  <SelectValue placeholder={labels.chooseGovernorate} />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((governorate) => (
                    <SelectItem key={governorate.code} value={governorate.code}>
                      {governorate.name[locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error("address.governorate") && <FieldError>{error("address.governorate")}</FieldError>}
            </Field>
            <TextField label={labels.city} required autoComplete="address-level2" value={draft.city} onValueChange={(value) => set("city", value)} error={error("address.city")} />
          </div>
          <TextField label={labels.street} required autoComplete="street-address" value={draft.street} onValueChange={(value) => set("street", value)} error={error("address.street")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={labels.building} value={draft.building} onValueChange={(value) => set("building", value)} error={error("address.building")} />
            <TextField label={labels.landmark} value={draft.landmark} onValueChange={(value) => set("landmark", value)} error={error("address.landmark")} />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-card">
          <legend className="sr-only">{labels.payment}</legend>
          <h2 className="font-display text-xl font-semibold text-primary-800">{labels.payment}</h2>
          {paymentMethods.includes("cod") && (
            <label className="stitch flex cursor-pointer items-center gap-3 rounded-xl border bg-secondary/60 p-4">
              <input type="radio" name="payment" value="cod" checked={draft.paymentMethod === "cod"} onChange={() => set("paymentMethod", "cod")} className="size-4 accent-primary-600" />
              <Banknote className="size-5 text-primary-600" aria-hidden />
              <span className="flex flex-col">
                <span className="font-medium">{labels.cod}</span>
                <span className="text-sm text-muted-foreground">{labels.codHint}</span>
              </span>
            </label>
          )}
        </fieldset>

        <Field>
          <FieldLabel htmlFor="order-notes">{labels.notes}</FieldLabel>
          <Textarea id="order-notes" rows={3} maxLength={500} value={draft.notes} onChange={(event) => set("notes", event.target.value)} />
          {error("notes") && <FieldDescription>{error("notes")}</FieldDescription>}
        </Field>
      </div>

      <OrderSummary
        locale={locale}
        labels={{ ...cartLabels, summary: labels.summary }}
        subtotal={subtotal}
        discount={discount}
        shipping={form.shippingFee}
        shippingText={form.shippingFee === undefined ? labels.shippingPick : form.shippingFee === 0 ? labels.free : undefined}
      >
        <ul className="flex flex-col gap-1 border-t border-dashed pt-3 text-sm text-muted-foreground">
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3">
              <span className="line-clamp-1">
                {line.quantity} × {line.name[locale]}
              </span>
            </li>
          ))}
        </ul>
        {delivery && <p className="text-sm text-muted-foreground">{labels.delivery.replace("{min}", String(delivery.min)).replace("{max}", String(delivery.max))}</p>}
        <Button type="submit" size="xl" className="w-full" disabled={form.pending}>
          {form.pending && <Spinner />}
          {labels.placeOrder}
        </Button>
      </OrderSummary>
    </form>
  );
}
