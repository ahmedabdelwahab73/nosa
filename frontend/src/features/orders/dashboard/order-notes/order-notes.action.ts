"use server";

import { refresh } from "next/cache";
import { orderNoteSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { ordersDashboardApi } from "../../api/orders.api";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

/** A private note on the order (the customer never sees it). */
export async function addOrderNote(id: string, input: unknown): Promise<ActionState> {
  const parsed = orderNoteSchema.safeParse(input);
  if (!OBJECT_ID.test(id) || !parsed.success) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    await ordersDashboardApi.addNote(token, id, parsed.data.note);
    refresh();
    return actionSuccess("created");
  } catch (error) {
    return toActionFailure(error);
  }
}
