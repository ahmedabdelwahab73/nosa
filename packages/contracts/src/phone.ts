import { z } from "zod";

/** Egyptian mobile prefixes: 010 Vodafone, 011 Etisalat, 012 Orange, 015 WE. */
const MOBILE = /^1[0125]\d{8}$/;

/**
 * Accepts 01012345678, +201012345678, 00201012345678, 201012345678 (spaces/dashes ignored)
 * and returns the canonical +201XXXXXXXXX, or null if it isn't an Egyptian mobile.
 */
export function normalizeEgyptPhone(input: string): string | null {
  let digits = input.replace(/[\s\-()]/g, "").replace(/^\+/, "");
  // Arabic-Indic digits typed on Arabic keyboards.
  digits = digits.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  return MOBILE.test(digits) ? `+20${digits}` : null;
}

export const phoneSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const phone = normalizeEgyptPhone(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "INVALID_PHONE" });
      return z.NEVER;
    }
    return phone;
  });
