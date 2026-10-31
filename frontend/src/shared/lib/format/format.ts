import { CURRENCY, type Locale } from "@nosa/contracts";

const INTL_LOCALE: Record<Locale, string> = { ar: "ar-EG", en: "en-EG" };

/** The only money formatter in the app. */
export function formatPrice(amount: number, locale: Locale) {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options ?? { dateStyle: "medium" }).format(new Date(date));
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}
