import "server-only";
import { HttpError } from "@/shared/lib/api/http";
import { actionFailure } from "./action-state";

/** The API names fields "body.phone"; forms only know "phone". */
const fieldName = (key: string) => key.replace(/^(body|query|params)\./, "");

/** Use in every Server Action's catch: expected API errors become values, the rest is logged. */
export function toActionFailure(error: unknown) {
  if (error instanceof HttpError) {
    const fieldErrors = error.details && Object.fromEntries(Object.entries(error.details).map(([key, value]) => [fieldName(key), value]));
    return actionFailure(error.code, fieldErrors);
  }
  console.error("Unexpected Server Action error", error);
  return actionFailure("INTERNAL_ERROR");
}
