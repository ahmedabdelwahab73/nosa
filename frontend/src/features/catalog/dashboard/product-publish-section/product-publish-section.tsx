"use client";

import { Eye, Search } from "lucide-react";
import { PRODUCT_STATUSES } from "@nosa/contracts";
import { LocalizedInput } from "@/shared/components/localized-input";
import { Panel } from "@/shared/components/panel";
import { siteConfig } from "@/shared/config/site";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { SectionProps } from "../lib/section-props";
import { slugify } from "../lib/variants";

type ProductPublishSectionProps = SectionProps & {
  statusLabels: Record<(typeof PRODUCT_STATUSES)[number], string>;
};

export function ProductPublishSection({ form, labels, locale, statusLabels }: ProductPublishSectionProps) {
  const { draft, update, error } = form;
  const t = labels.publishCard;
  const seo = labels.seo;

  const slug = draft.slug || slugify(draft.name.en) || "…";
  const previewTitle = draft.seo.title[locale] || draft.name[locale] || "…";
  const previewText = draft.seo.description[locale] || draft.description[locale] || "";

  return (
    <>
      <Panel title={t.title} icon={<Eye />}>
        <Field>
          <FieldLabel>{t.status}</FieldLabel>
          <Select value={draft.status} onValueChange={(status) => update((d) => ({ ...d, status: status as typeof d.status }))}>
            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field data-invalid={!!error("slug")}>
          <FieldLabel htmlFor="slug">{t.slug}</FieldLabel>
          <Input id="slug" dir="ltr" value={draft.slug} placeholder={slugify(draft.name.en)} aria-invalid={!!error("slug")}
            onChange={(event) => update((d) => ({ ...d, slug: event.target.value.toLowerCase() }))} />
          <FieldDescription>{t.slugHint}</FieldDescription>
          {error("slug") && <FieldError>{error("slug")}</FieldError>}
        </Field>
      </Panel>

      <Panel title={seo.title} icon={<Search />}>
        <p className="text-sm text-muted-foreground">{seo.hint}</p>
        <div className="rounded-xl border bg-card p-3" dir="ltr">
          <p className="truncate text-xs text-muted-foreground">{siteConfig.url}/{locale}/products/{slug}</p>
          <p className="truncate text-base text-info">{previewTitle}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{previewText}</p>
        </div>
        <LocalizedInput
          label={seo.seoTitle}
          value={draft.seo.title}
          onChange={(title) => update((d) => ({ ...d, seo: { ...d.seo, title } }))}
          languageLabels={labels.languages}
          maxLength={70}
        />
        <LocalizedInput
          label={seo.seoDescription}
          multiline
          value={draft.seo.description}
          onChange={(description) => update((d) => ({ ...d, seo: { ...d.seo, description } }))}
          languageLabels={labels.languages}
          maxLength={160}
        />
      </Panel>
    </>
  );
}
