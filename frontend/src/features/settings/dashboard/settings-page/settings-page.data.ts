import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { settingsDashboardApi } from "../../api/settings.api";
import { draftFromSettings } from "../lib/settings-draft";

/** Request-time read: the form must start from what is saved right now. */
export async function getSettingsDraft() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return draftFromSettings((await settingsDashboardApi.get(token)).data);
}
