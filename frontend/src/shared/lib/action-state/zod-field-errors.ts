type Issue = { code: string; path: PropertyKey[]; message: string };

const ERROR_CODE = /^[A-Z][A-Z_]+$/;

/**
 * Turns a zod issue into a short code the UI can translate: our own codes ("INVALID_PHONE",
 * "DUPLICATE_SKU") pass through, built-in zod failures become REQUIRED / TOO_LONG / INVALID.
 */
function issueCode({ code, message }: Issue) {
  if (ERROR_CODE.test(message)) return message;
  if (code === "too_small" || code === "invalid_type") return "REQUIRED";
  if (code === "too_big") return "TOO_LONG";
  return "INVALID";
}

/** `{ "name.ar": ["REQUIRED"] }` — keyed by the dotted path, so forms can find their field. */
export function zodFieldErrors(error: { issues: Issue[] }) {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) (errors[issue.path.join(".") || "form"] ??= []).push(issueCode(issue));
  return errors;
}
