import { API_ERROR_CODES } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import { getDictionary } from "./get-dictionary";

/** Translated toast messages for useActionFeedback; call in the Server parent of any form. */
export async function getFeedbackMessages(): Promise<FeedbackMessages> {
  const dict = await getDictionary();
  return {
    success: dict.feedback,
    errors: Object.fromEntries(API_ERROR_CODES.map((code) => [code, dict.errors[code]])) as FeedbackMessages["errors"],
  };
}
