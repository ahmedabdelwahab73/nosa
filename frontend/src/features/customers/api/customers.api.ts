import "server-only";
import type { CustomerListItem } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

export const customersDashboardApi = {
  list: (token: string, query: { page?: number; limit?: number; q?: string }) =>
    http<CustomerListItem[]>("/dashboard/users/customers", { token, query }),
};
