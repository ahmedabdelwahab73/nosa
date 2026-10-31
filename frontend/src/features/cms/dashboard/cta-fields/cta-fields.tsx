"use client";

import type { Locale, LocalizedText } from "@nosa/contracts";
import { LocalizedInput } from "@/shared/components/localized-input";
import { TextField } from "@/shared/components/text-field";

export type Cta = { label: LocalizedText; href: string };

type CtaFieldsProps = {
  /** e.g. "Main button". */
  title: string;
  value: Cta;
  onChange: (value: Cta) => void;
  labelText: string;
  linkText: string;
  linkHint: string;
  languages: Record<Locale, string>;
  /** Error message per path relative to this button ("label.ar", "href"). */
  error: (path: string) => string | undefined;
};

/** A button of a home section: its text in both languages and where it goes. */
export function CtaFields({ title, value, onChange, labelText, linkText, linkHint, languages, error }: CtaFieldsProps) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-2xl border border-dashed p-4">
      <legend className="px-2 text-sm font-medium text-primary-800">{title}</legend>
      <LocalizedInput
        label={labelText}
        value={value.label}
        onChange={(label) => onChange({ ...value, label })}
        languageLabels={languages}
        errors={{ ar: error("label.ar"), en: error("label.en") }}
        maxLength={40}
      />
      <TextField label={linkText} dir="ltr" placeholder="/shop" value={value.href} onValueChange={(href) => onChange({ ...value, href })} error={error("href")} hint={linkHint} />
    </fieldset>
  );
}
