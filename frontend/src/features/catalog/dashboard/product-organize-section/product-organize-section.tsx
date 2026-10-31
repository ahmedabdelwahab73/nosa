"use client";

import { Plus, Tags, X } from "lucide-react";
import { Panel } from "@/shared/components/panel";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import type { SectionProps } from "../lib/section-props";
import { useProductOrganize } from "./product-organize-section.ux";

type ProductOrganizeSectionProps = SectionProps & {
  categories: { id: string; name: { ar: string; en: string } }[];
};

export function ProductOrganizeSection({ form, labels, locale, categories }: ProductOrganizeSectionProps) {
  const { draft, update, error } = form;
  const t = labels.organize;
  const organize = useProductOrganize(form);

  return (
    <Panel title={t.title} icon={<Tags />}>
      <Field data-invalid={!!error("category")}>
        <FieldLabel>{t.category} <span className="text-destructive">*</span></FieldLabel>
        <Select value={draft.categoryId} onValueChange={(categoryId) => update((d) => ({ ...d, categoryId }))}>
          <SelectTrigger className="bg-card" aria-invalid={!!error("category")}>
            <SelectValue placeholder={t.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name[locale]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error("category") && <FieldError>{error("category")}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="tags">{t.tags}</FieldLabel>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-2">
          {draft.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 rounded-full bg-primary-50 py-1 ps-3 pe-1 text-sm text-primary-800">
              {tag}
              <button type="button" onClick={() => organize.removeTag(tag)} aria-label={`${labels.variants.remove}: ${tag}`} className="flex size-5 items-center justify-center rounded-full hover:bg-primary-100">
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            id="tags"
            value={organize.tag}
            onChange={(event) => organize.setTag(event.target.value)}
            onKeyDown={organize.onTagKeyDown}
            onBlur={organize.addTag}
            placeholder={t.tagPlaceholder}
            className="min-w-32 flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel>{t.setItems}</FieldLabel>
        {draft.setItems.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {draft.setItems.map((item, index) => (
              <li key={index} className="flex items-center gap-1 rounded-full border bg-card py-1 ps-3 pe-1 text-sm">
                {item[locale]}
                <button type="button" onClick={() => organize.removeSetItem(index)} aria-label={`${labels.variants.remove}: ${item[locale]}`} className="flex size-5 items-center justify-center rounded-full hover:bg-muted">
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <Input className="w-32" lang="ar" dir="rtl" value={organize.setItem.ar} placeholder={t.setItemPlaceholder.ar} aria-label={labels.variants.valueAr}
            onChange={(event) => organize.setSetItem((item) => ({ ...item, ar: event.target.value }))} />
          <Input className="w-32" lang="en" dir="ltr" value={organize.setItem.en} placeholder={t.setItemPlaceholder.en} aria-label={labels.variants.valueEn}
            onChange={(event) => organize.setSetItem((item) => ({ ...item, en: event.target.value }))} />
          <Button type="button" variant="outline" onClick={organize.addSetItem} disabled={!organize.canAddSetItem}>
            <Plus />
            {t.addSetItem}
          </Button>
        </div>
      </Field>

      <Field orientation="horizontal" className="items-center">
        <Switch id="featured" checked={draft.isFeatured} onCheckedChange={(isFeatured) => update((d) => ({ ...d, isFeatured }))} />
        <FieldLabel htmlFor="featured">{t.featured}</FieldLabel>
      </Field>
    </Panel>
  );
}
