import type { CheckoutInput, PaymentMethod } from "@nosa/contracts";

/** What the checkout form holds while typing. */
export type CheckoutDraft = {
  name: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  street: string;
  building: string;
  landmark: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

export const emptyCheckoutDraft = (prefill: Partial<Pick<CheckoutDraft, "name" | "phone" | "email">> = {}): CheckoutDraft => ({
  name: "",
  phone: "",
  email: "",
  governorate: "",
  city: "",
  street: "",
  building: "",
  landmark: "",
  notes: "",
  paymentMethod: "cod",
  ...prefill,
});

/** Blank optional fields are left out, so the shared zod schema treats them as "not given". */
export function toCheckoutInput(draft: CheckoutDraft): CheckoutInput {
  const optional = (value: string) => (value.trim() ? value.trim() : undefined);
  return {
    contact: { name: draft.name, phone: draft.phone, email: optional(draft.email) },
    address: { governorate: draft.governorate, city: draft.city, street: draft.street, building: optional(draft.building), landmark: optional(draft.landmark) },
    paymentMethod: draft.paymentMethod,
    notes: optional(draft.notes),
  };
}
