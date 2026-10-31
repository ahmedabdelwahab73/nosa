"use client";

import { Plus, Trash2, Wand2 } from "lucide-react";
import { CUSTOMIZATION_FIELD_TYPES } from "@nosa/contracts";
import { LocalizedInput } from "@/shared/components/localized-input";
import { Panel } from "@/shared/components/panel";
import { Button } from "@/shared/ui/button";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import type { CustomFieldDraft, CustomFieldType } from "../lib/product-draft";
import type { SectionProps } from "../lib/section-props";
import { slugify } from "../lib/variants";

export function ProductCustomizationSection({ form, labels }: SectionProps) {
  const { draft, update, error } = form;
  const t = labels.customization;
  const { enabled, fields } = draft.customization;

  const patch = (change: Partial<typeof draft.customization>) => update((d) => ({ ...d, customization: { ...d.customization, ...change } }));
  const patchField = (index: number, change: Partial<CustomFieldDraft>) =>
    patch({ fields: fields.map((field, i) => (i === index ? { ...field, ...change } : field)) });

  const addField = () =>
    patch({
      fields: [...fields, { key: `field_${fields.length + 1}`, label: { ar: "", en: "" }, type: "text", required: false, maxLength: "20" }],
    });

  return (
    <Panel title={t.title} icon={<Wand2 />}>
      <Field orientation="horizontal" className="items-center">
        <Switch id="customization" checked={enabled} onCheckedChange={(value) => patch({ enabled: value })} />
        <FieldLabel htmlFor="customization">{t.enabled}</FieldLabel>
      </Field>

      {enabled && (
        <>
          <Field className="max-w-48">
            <FieldLabel htmlFor="customExtra">{t.extraPrice}</FieldLabel>
            <Input id="customExtra" type="number" min={0} step="0.01" dir="ltr" value={draft.customization.extraPrice} onChange={(event) => patch({ extraPrice: event.target.value })} />
          </Field>

          {fields.length === 0 && <p className="rounded-xl bg-muted/60 px-4 py-6 text-center text-sm text-muted-foreground">{t.empty}</p>}

          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-4">
              <LocalizedInput
                label={t.label}
                value={field.label}
                onChange={(label) => patchField(index, { label, key: slugify(label.en).replace(/-/g, "_") || field.key })}
                languageLabels={labels.languages}
                errors={{ ar: error(`customization.fields.${index}.label.ar`), en: error(`customization.fields.${index}.label.en`) }}
              />
              <div className="flex flex-wrap items-end gap-4">
                <Field className="w-40">
                  <FieldLabel>{t.type}</FieldLabel>
                  <Select value={field.type} onValueChange={(type) => patchField(index, { type: type as CustomFieldType })}>
                    <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CUSTOMIZATION_FIELD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{t.types[type]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                {(field.type === "text" || field.type === "note") && (
                  <Field className="w-28">
                    <FieldLabel>{t.maxLength}</FieldLabel>
                    <Input type="number" min={1} max={500} dir="ltr" value={field.maxLength} onChange={(event) => patchField(index, { maxLength: event.target.value })} />
                  </Field>
                )}
                <Field orientation="horizontal" className="items-center">
                  <Switch checked={field.required} onCheckedChange={(required) => patchField(index, { required })} />
                  <FieldLabel>{t.required}</FieldLabel>
                </Field>
                <Button type="button" variant="ghost" className="ms-auto text-destructive" onClick={() => patch({ fields: fields.filter((_, i) => i !== index) })}>
                  <Trash2 />
                  {t.remove}
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" className="self-start" onClick={addField} disabled={fields.length >= 10}>
            <Plus />
            {t.addField}
          </Button>
        </>
      )}
    </Panel>
  );
}
