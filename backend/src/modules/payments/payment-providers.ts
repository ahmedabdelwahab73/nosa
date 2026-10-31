import type { PaymentMethod, PaymentStatus } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";

/**
 * Every payment method plugs in behind this interface. Only cash on delivery is implemented;
 * card / wallet / InstaPay wait for the client's gateway decision (Paymob, Fawry...).
 */
export interface PaymentProvider {
  readonly method: PaymentMethod;
  /** Called when the order is created. Online gateways will return a redirect URL here. */
  start(order: { id: string; number: string; total: number }): Promise<{ status: PaymentStatus; redirectUrl?: string }>;
}

const cashOnDelivery: PaymentProvider = {
  method: "cod",
  start: async () => ({ status: "unpaid" }),
};

const PROVIDERS: Partial<Record<PaymentMethod, PaymentProvider>> = { cod: cashOnDelivery };

export function getPaymentProvider(method: PaymentMethod, enabledMethods: readonly string[]) {
  const provider = PROVIDERS[method];
  if (!provider || !enabledMethods.includes(method)) {
    throw new ApiError("VALIDATION_ERROR", "This payment method isn't available yet", {
      "body.paymentMethod": ["PAYMENT_METHOD_UNAVAILABLE"],
    });
  }
  return provider;
}
