import "server-only";
import type { CreateStaffInput, SessionUser, StaffMemberDto, UpdateStaffInput } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Dashboard endpoints for staff accounts (managers only; Express checks the role on each call). */
export const teamApi = {
  list: (token: string) => http<StaffMemberDto[]>("/dashboard/users/staff", { token }),
  create: (token: string, body: CreateStaffInput) => http<SessionUser>("/dashboard/users/staff", { method: "POST", token, body }),
  update: (token: string, id: string, body: UpdateStaffInput) =>
    http<SessionUser>(`/dashboard/users/staff/${id}`, { method: "PATCH", token, body }),
};
