import "server-only";
import type { SettingsDto, SettingsInput } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** Dashboard endpoints; the public subset is read by shared/lib/settings. */
export const settingsDashboardApi = {
  get: (token: string) => http<SettingsDto>("/dashboard/settings", { token }),
  update: (token: string, body: SettingsInput) => http<SettingsDto>("/dashboard/settings", { method: "PUT", token, body }),
};
