import { z } from "zod";

export const LOCALES = ["ar", "en"] as const;
export const DEFAULT_LOCALE = "ar" satisfies Locale;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Any user-facing text stored in the database is saved in both languages. */
export const localizedTextSchema = z.object({
  ar: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;
