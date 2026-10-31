"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { changePasswordSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken, writeSessionCookies } from "@/shared/lib/auth";
import { authApi } from "@/shared/lib/auth/auth.api";

/** Changes the signed-in user's password. The API signs every other device out and returns a fresh session. */
export async function changeMyPassword(input: unknown): Promise<ActionState> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    const { data } = await authApi.changePassword(token, parsed.data);
    writeSessionCookies(await cookies(), data.tokens);
    refresh();
    return actionSuccess("saved");
  } catch (error) {
    return toActionFailure(error);
  }
}
