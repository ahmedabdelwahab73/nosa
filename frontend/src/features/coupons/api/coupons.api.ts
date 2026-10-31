import "server-only";
import type { CouponDto, CouponInput } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Dashboard coupon endpoints (managers write; Express checks the role on each call). */
export const couponsDashboardApi = {
  list: (token: string) => http<CouponDto[]>("/dashboard/coupons", { token }),
  create: (token: string, body: CouponInput) => http<CouponDto>("/dashboard/coupons", { method: "POST", token, body }),
  update: (token: string, id: string, body: CouponInput) => http<CouponDto>(`/dashboard/coupons/${id}`, { method: "PUT", token, body }),
  remove: (token: string, id: string) => http<unknown>(`/dashboard/coupons/${id}`, { method: "DELETE", token }),
};
