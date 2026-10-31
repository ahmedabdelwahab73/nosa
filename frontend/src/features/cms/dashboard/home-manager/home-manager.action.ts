"use server";

import { refresh } from "next/cache";
import { homeSectionInputSchema } from "@nosa/contracts";
import { actionFailure, actionSuccess, zodFieldErrors, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { getAccessToken } from "@/shared/lib/auth";
import { loadDictionary } from "@/shared/i18n/get-dictionary";
import { cmsDashboardApi } from "../../api/cms.dashboard.api";
import { defaultHomeSections } from "../../lib/home-sections";

const OBJECT_ID = /^[a-f0-9]{24}$/i;

async function editorToken() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return token;
}

/** Adds a section (`id` null) or updates one. Express re-checks the role and the content shape. */
export async function saveSection(id: string | null, input: unknown): Promise<ActionState> {
  if (id !== null && !OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  const parsed = homeSectionInputSchema.safeParse(input);
  if (!parsed.success) return actionFailure("VALIDATION_ERROR", zodFieldErrors(parsed.error));
  try {
    const token = await editorToken();
    if (id) await cmsDashboardApi.updateSection(token, id, parsed.data);
    else await cmsDashboardApi.createSection(token, parsed.data);
    refresh();
    return actionSuccess(id ? "updated" : "created");
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function removeSection(id: string): Promise<ActionState> {
  if (!OBJECT_ID.test(id)) return actionFailure("VALIDATION_ERROR");
  try {
    await cmsDashboardApi.deleteSection(await editorToken(), id);
    refresh();
    return actionSuccess("deleted");
  } catch (error) {
    return toActionFailure(error);
  }
}

/** The full new order of every section (shown and hidden ones). */
export async function reorderSections(ids: string[]): Promise<ActionState> {
  if (!ids.length || !ids.every((id) => OBJECT_ID.test(id))) return actionFailure("VALIDATION_ERROR");
  try {
    await cmsDashboardApi.reorderSections(await editorToken(), ids);
    refresh();
    return actionSuccess("updated");
  } catch (error) {
    return toActionFailure(error);
  }
}

/** Copies the built-in home page into the owner's editable list, so she edits it instead of starting blank. */
export async function seedDefaultSections(): Promise<ActionState> {
  try {
    const token = await editorToken();
    if ((await cmsDashboardApi.sections(token)).data.length) return actionFailure("CONFLICT");
    const [ar, en] = await Promise.all([loadDictionary("ar"), loadDictionary("en")]);
    for (const { content } of defaultHomeSections({ ar, en })) {
      await cmsDashboardApi.createSection(token, { content, isActive: true });
    }
    refresh();
    return actionSuccess("created");
  } catch (error) {
    return toActionFailure(error);
  }
}
