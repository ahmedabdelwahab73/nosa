import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { teamApi } from "../../api/team.api";

/** Request-time read of every dashboard account, active or not. */
export async function listStaff() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return (await teamApi.list(token)).data;
}
