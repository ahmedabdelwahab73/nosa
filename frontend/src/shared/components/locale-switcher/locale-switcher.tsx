import { LOCALES } from "@nosa/contracts";
import { getLocale } from "@/shared/i18n/get-dictionary";
import { LocaleLink } from "./locale-link";

type LocaleSwitcherProps = {
  /** Already translated by the server parent, e.g. "English" on Arabic pages. */
  label: string;
  className?: string;
};

/** Button that shows the same page in the other language. */
export async function LocaleSwitcher({ label, className }: LocaleSwitcherProps) {
  const current = await getLocale();
  const nextLocale = LOCALES.find((locale) => locale !== current) ?? current;
  return <LocaleLink nextLocale={nextLocale} label={label} className={className} />;
}
