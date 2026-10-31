"use server";

import { MEDIA_FOLDERS, type MediaFolder, type MediaSignature } from "@nosa/contracts";
import { actionFailure, actionSuccess, type ActionState } from "@/shared/lib/action-state";
import { toActionFailure } from "@/shared/lib/action-state/to-action-failure";
import { http } from "@/shared/lib/api/http";
import { getAccessToken } from "@/shared/lib/auth";

/** Asks Express to sign a direct browser → Cloudinary upload. The image bytes never touch our servers. */
export async function signImageUpload(folder: MediaFolder): Promise<ActionState<MediaSignature>> {
  if (!MEDIA_FOLDERS.includes(folder)) return actionFailure("VALIDATION_ERROR");
  try {
    const token = await getAccessToken();
    if (!token) return actionFailure("UNAUTHORIZED");
    const { data } = await http<MediaSignature>("/media/sign", { method: "POST", token, body: { folder } });
    return actionSuccess("saved", data);
  } catch (error) {
    return toActionFailure(error);
  }
}
