import { notFound } from "next/navigation";
import { locale } from "next/root-params";
import { isLocale, type Locale } from "@nosa/contracts";

const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
} satisfies Record<Locale, unknown>;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ar"]>>;

/** Current locale from the [locale] root segment — usable from any Server Component. */
export async function getLocale(): Promise<Locale> {
  const value = await locale();
  if (!isLocale(value)) notFound();
  return value;
}

/** A specific language, for the few places that need both at once (seeding the editable home page). */
export const loadDictionary = (target: Locale): Promise<Dictionary> => dictionaries[target]();

export async function getDictionary(): Promise<Dictionary> {
  return loadDictionary(await getLocale());
}
