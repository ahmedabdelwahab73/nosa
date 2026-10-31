"use client";

import { useId } from "react";
import { LOCALES, type Locale, type LocalizedText } from "@nosa/contracts";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

type LocalizedInputProps = {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  /** Tab names, e.g. { ar: "العربية", en: "English" }. */
  languageLabels: Record<Locale, string>;
  /** Already translated error message per language. */
  errors?: Partial<Record<Locale, string | undefined>>;
  /** Language shown first; the site's main language by default. */
  defaultLocale?: Locale;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
  placeholder?: Partial<Record<Locale, string>>;
  className?: string;
};

/**
 * One text stored in both languages (the database holds `{ ar, en }`), edited with language tabs.
 * A dot on a tab shows that the other language has an error, so nothing is hidden behind a tab.
 */
export function LocalizedInput({
  label,
  value,
  onChange,
  languageLabels,
  errors,
  defaultLocale = "ar",
  multiline,
  required,
  maxLength,
  placeholder,
  className,
}: LocalizedInputProps) {
  const id = useId();

  return (
    <Field className={className}>
      <FieldLabel htmlFor={`${id}-${defaultLocale}`}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Tabs defaultValue={defaultLocale}>
        <TabsList>
          {LOCALES.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="gap-1.5">
              {languageLabels[locale]}
              {errors?.[locale] && <span className="size-1.5 rounded-full bg-destructive" aria-hidden />}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((locale) => {
          const invalid = Boolean(errors?.[locale]);
          const shared = {
            id: `${id}-${locale}`,
            value: value[locale],
            lang: locale,
            "aria-label": `${label} (${languageLabels[locale]})`,
            dir: locale === "ar" ? "rtl" : "ltr",
            maxLength,
            placeholder: placeholder?.[locale],
            "aria-invalid": invalid,
            onChange: (event: { target: { value: string } }) => onChange({ ...value, [locale]: event.target.value }),
          } as const;
          return (
            <TabsContent key={locale} value={locale} className="mt-2 flex flex-col gap-1.5">
              {multiline ? <Textarea rows={5} {...shared} /> : <Input {...shared} />}
              {errors?.[locale] && <FieldError>{errors[locale]}</FieldError>}
            </TabsContent>
          );
        })}
      </Tabs>
    </Field>
  );
}
