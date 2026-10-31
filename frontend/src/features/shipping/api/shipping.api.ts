import "server-only";
import type { GovernorateDto } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

type RateInput = { fee: number; estimatedDays: { min: number; max: number }; isActive: boolean };

/** Dashboard shipping endpoints (managers only; Express checks the role). */
export const shippingDashboardApi = {
  list: (token: string) => http<GovernorateDto[]>("/dashboard/shipping/governorates", { token }),
  update: (token: string, code: string, body: RateInput) =>
    http<GovernorateDto>(`/dashboard/shipping/governorates/${code}`, { method: "PUT", token, body }),
};
