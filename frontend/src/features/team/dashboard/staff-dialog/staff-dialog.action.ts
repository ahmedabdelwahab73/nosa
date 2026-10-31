"use server";

import { refresh } from "next/cache";
import { createStaffSchema, updateStaffSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { teamApi } from "../../api/team.api";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/** Adds a staff member (`id` null) or updates one. Express checks the role and the owner rules again. */
export async function saveStaff(id: string | null, input: unknown): Promise<ActionState> {
  if (id !== null && !OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");

  const parsed = id ? updateStaffSchema.safeParse(input) : createStaffSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));

  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    if (id) await teamApi.update(token, id, parsed.data);
    else await teamApi.create(token, parsed.data as Parameters<typeof teamApi.create>[1]);
    refresh();
    return actionSuccess(id ? "updated" : "created");
  } catch (error) {
    return toActionFailure(error);
  }
}
