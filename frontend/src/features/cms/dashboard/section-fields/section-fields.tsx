"use client";

import { Plus, X } from "lucide-react";
import type { HomeSectionContent, Locale } from "@nosa/contracts";
import { ImageUploader, type ImageUploaderLabels } from "@/shared/components/image-uploader";
import { LocalizedInput } from "@/shared/components/localized-input";
import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { CtaFields } from "../cta-fields";

type SectionFieldsProps = {
  content: HomeSectionContent;
  onChange: (content: HomeSectionContent) => void;
  error: (path: string) => string | undefined;
  labels: Dictionary["dashboard"]["content"]["home"]["fields"];
  languages: Record<Locale, string>;
  categories: { slug: string; name: Record<Locale, string> }[];
  locale: Locale;
  uploaderLabels: ImageUploaderLabels;
  messages: FeedbackMessages;
};

const LIMITS = [4, 6, 8, 12] as const;
const blank = { ar: "", en: "" };

/** The form of one home section. Only the fields of its type are shown; the schema in contracts is the final judge. */
export function SectionFields({ content, onChange, error, labels, languages, categories, locale, uploaderLabels, messages }: SectionFieldsProps) {
  const sub = (prefix: string) => (path: string) => error(`${prefix}.${path}`);
  const title = (
    <LocalizedInput
      label={labels.title}
      required
      value={content.title ?? blank}
      onChange={(next) => onChange({ ...content, title: next } as HomeSectionContent)}
      languageLabels={languages}
      errors={{ ar: error("title.ar"), en: error("title.en") }}
      maxLength={80}
    />
  );
  const cta = (key: "primaryCta" | "secondaryCta" | "cta", heading: string, value: { label: typeof blank; href: string }) => (
    <CtaFields
      title={heading}
      value={value}
      onChange={(next) => onChange({ ...content, [key]: next } as HomeSectionContent)}
      labelText={labels.ctaLabel}
      linkText={labels.ctaLink}
      linkHint={labels.ctaLinkHint}
      languages={languages}
      error={sub(key)}
    />
  );
  const optionalCta = (key: "secondaryCta" | "cta", heading: string, value: { label: typeof blank; href: string } | undefined) =>
    value ? (
      <div className="flex flex-col gap-2">
        {cta(key, heading, value)}
        <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => onChange({ ...content, [key]: undefined } as HomeSectionContent)}>
          <X />
          {labels.removeButton}
        </Button>
      </div>
    ) : (
      <Button type="button" variant="outline" className="w-fit" onClick={() => onChange({ ...content, [key]: { label: blank, href: "/shop" } } as HomeSectionContent)}>
        <Plus />
        {heading}
      </Button>
    );
  const image = (value: { publicId: string }[] | undefined, setImages: (images: Parameters<typeof ImageUploader>[0]["value"]) => void) => (
    <Field>
      <FieldLabel>{labels.image}</FieldLabel>
      <ImageUploader folder="cms" value={(value ?? []) as Parameters<typeof ImageUploader>[0]["value"]} onChange={setImages} maxFiles={1} labels={uploaderLabels} feedback={messages} error={error("image")} />
      <FieldDescription>{labels.imageHint}</FieldDescription>
    </Field>
  );

  switch (content.type) {
    case "hero":
      return (
        <>
          {title}
          <LocalizedInput label={labels.subtitle} multiline value={content.subtitle ?? blank} onChange={(subtitle) => onChange({ ...content, subtitle })} languageLabels={languages} maxLength={200} />
          {image(content.image ? [content.image] : [], (images) => onChange({ ...content, image: images[0] }))}
          {cta("primaryCta", labels.primaryButton, content.primaryCta)}
          {optionalCta("secondaryCta", labels.secondaryButton, content.secondaryCta)}
        </>
      );

    case "categories":
      return (
        <>
          {title}
          <Field>
            <FieldLabel>{labels.categories}</FieldLabel>
            <FieldDescription>{labels.categoriesHint}</FieldDescription>
            <ul className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => {
                const checked = content.categorySlugs.includes(category.slug);
                return (
                  <li key={category.slug}>
                    <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          onChange({ ...content, categorySlugs: checked ? content.categorySlugs.filter((slug) => slug !== category.slug) : [...content.categorySlugs, category.slug] })
                        }
                      />
                      {category.name[locale]}
                    </label>
                  </li>
                );
              })}
            </ul>
          </Field>
        </>
      );

    case "products":
      return (
        <>
          {title}
          <Field>
            <FieldLabel>{labels.source}</FieldLabel>
            <Select value={content.source} onValueChange={(source) => onChange({ ...content, source: source as typeof content.source })}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["bestsellers", "newest", "featured", "category"] as const).map((source) => (
                  <SelectItem key={source} value={source}>
                    {labels.sources[source]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {content.source === "category" && (
            <Field>
              <FieldLabel>{labels.category}</FieldLabel>
              <Select value={content.categorySlug ?? ""} onValueChange={(categorySlug) => onChange({ ...content, categorySlug })}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder={labels.category} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name[locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field>
            <FieldLabel>{labels.limit}</FieldLabel>
            <Select value={String(content.limit)} onValueChange={(limit) => onChange({ ...content, limit: Number(limit) })}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIMITS.map((limit) => (
                  <SelectItem key={limit} value={String(limit)}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </>
      );

    case "banner":
      return (
        <>
          {title}
          <LocalizedInput label={labels.text} multiline value={content.text ?? blank} onChange={(text) => onChange({ ...content, text })} languageLabels={languages} maxLength={200} />
          {image(content.image ? [content.image] : [], (images) => onChange({ ...content, image: images[0] }))}
          {optionalCta("cta", labels.button, content.cta)}
          <Field>
            <FieldLabel>{labels.steps}</FieldLabel>
            <FieldDescription>{labels.stepsHint}</FieldDescription>
            {(content.steps ?? []).map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <LocalizedInput
                  label={`${labels.step} ${index + 1}`}
                  value={step}
                  onChange={(next) => onChange({ ...content, steps: (content.steps ?? []).map((item, at) => (at === index ? next : item)) })}
                  languageLabels={languages}
                  errors={{ ar: error(`steps.${index}.ar`), en: error(`steps.${index}.en`) }}
                  maxLength={60}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon-sm" aria-label={labels.removeStep} onClick={() => onChange({ ...content, steps: (content.steps ?? []).filter((_, at) => at !== index) })}>
                  <X />
                </Button>
              </div>
            ))}
            {(content.steps?.length ?? 0) < 4 && (
              <Button type="button" variant="outline" className="w-fit" onClick={() => onChange({ ...content, steps: [...(content.steps ?? []), blank] })}>
                <Plus />
                {labels.addStep}
              </Button>
            )}
          </Field>
        </>
      );

    case "richText":
      return (
        <>
          <LocalizedInput
            label={labels.title}
            value={content.title ?? blank}
            onChange={(next) => onChange({ ...content, title: next })}
            languageLabels={languages}
            errors={{ ar: error("title.ar"), en: error("title.en") }}
            maxLength={80}
          />
          <LocalizedInput
            label={labels.body}
            required
            multiline
            value={content.body}
            onChange={(body) => onChange({ ...content, body })}
            languageLabels={languages}
            errors={{ ar: error("body.ar"), en: error("body.en") }}
            maxLength={1500}
          />
          <p className="text-xs text-muted-foreground">{labels.bodyHint}</p>
          {image(content.image ? [content.image] : [], (images) => onChange({ ...content, image: images[0] }))}
          {optionalCta("cta", labels.button, content.cta)}
          <Field>
            <FieldLabel>{labels.stats}</FieldLabel>
            <FieldDescription>{labels.statsHint}</FieldDescription>
            {(content.stats ?? []).map((stat, index) => (
              <div key={index} className="flex items-start gap-2">
                <TextField
                  label={labels.statValue}
                  dir="ltr"
                  value={stat.value}
                  maxLength={12}
                  className="w-28"
                  onValueChange={(value) => onChange({ ...content, stats: (content.stats ?? []).map((item, at) => (at === index ? { ...item, value } : item)) })}
                  error={error(`stats.${index}.value`)}
                />
                <LocalizedInput
                  label={labels.statLabel}
                  value={stat.label}
                  onChange={(next) => onChange({ ...content, stats: (content.stats ?? []).map((item, at) => (at === index ? { ...item, label: next } : item)) })}
                  languageLabels={languages}
                  errors={{ ar: error(`stats.${index}.label.ar`), en: error(`stats.${index}.label.en`) }}
                  maxLength={40}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon-sm" aria-label={labels.removeStat} onClick={() => onChange({ ...content, stats: (content.stats ?? []).filter((_, at) => at !== index) })}>
                  <X />
                </Button>
              </div>
            ))}
            {(content.stats?.length ?? 0) < 4 && (
              <Button type="button" variant="outline" className="w-fit" onClick={() => onChange({ ...content, stats: [...(content.stats ?? []), { value: "", label: blank }] })}>
                <Plus />
                {labels.addStat}
              </Button>
            )}
          </Field>
        </>
      );

    case "stories":
    case "reviews":
      return (
        <>
          {title}
          <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">{content.type === "stories" ? labels.storiesNote : labels.reviewsNote}</p>
        </>
      );
  }
}
