"use client";

import { FileText } from "lucide-react";
import { LocalizedInput } from "@/shared/components/localized-input";
import { Panel } from "@/shared/components/panel";
import type { SectionProps } from "../lib/section-props";

export function ProductBasicsSection({ form, labels }: SectionProps) {
  const { draft, update, error } = form;
  const t = labels.basics;

  return (
    <Panel title={t.title} icon={<FileText />}>
      <LocalizedInput
        label={t.name}
        required
        value={draft.name}
        onChange={(name) => update((d) => ({ ...d, name }))}
        languageLabels={labels.languages}
        errors={{ ar: error("name.ar"), en: error("name.en") }}
        maxLength={120}
        placeholder={t.namePlaceholder}
      />
      <LocalizedInput
        label={t.description}
        required
        multiline
        value={draft.description}
        onChange={(description) => update((d) => ({ ...d, description }))}
        languageLabels={labels.languages}
        errors={{ ar: error("description.ar"), en: error("description.en") }}
      />
      <LocalizedInput
        label={t.care}
        multiline
        value={draft.care}
        onChange={(care) => update((d) => ({ ...d, care }))}
        languageLabels={labels.languages}
      />
    </Panel>
  );
}
