"use client";

import type { HomeSectionDto, HomeSectionType, Locale } from "@nosa/contracts";
import type { ImageUploaderLabels } from "@/shared/components/image-uploader";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { emptySection } from "../../lib/section-draft";
import { SectionFields } from "../section-fields";
import { useSectionDialog } from "./section-dialog.ux";

type SectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The section being edited; null adds a new one of `newType`. */
  section: HomeSectionDto | null;
  newType: HomeSectionType;
  locale: Locale;
  labels: Dictionary["dashboard"]["content"];
  languages: Record<Locale, string>;
  categories: { slug: string; name: Record<Locale, string> }[];
  uploaderLabels: ImageUploaderLabels;
  invalidMessage: string;
  messages: FeedbackMessages;
};

/** Mounted fresh for every open (the parent keys it), so the form always starts from the right values. */
export function SectionDialog({ open, onOpenChange, section, newType, locale, labels, languages, categories, uploaderLabels, invalidMessage, messages }: SectionDialogProps) {
  const form = useSectionDialog({
    sectionId: section?.id ?? null,
    initial: section?.content ?? emptySection(newType),
    initialActive: section?.isActive ?? true,
    messages,
    errorLabels: labels.errors,
    invalidMessage,
    onSaved: () => onOpenChange(false),
  });
  const home = labels.home;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary-800">
            {section ? home.form.titleEdit : home.form.titleNew}: {home.types[form.content.type]}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.submit} className="flex flex-col gap-4" noValidate>
          <SectionFields
            content={form.content}
            onChange={form.update}
            error={form.error}
            labels={home.fields}
            languages={languages}
            categories={categories}
            locale={locale}
            uploaderLabels={uploaderLabels}
            messages={messages}
          />
          <Field orientation="horizontal" className="items-center">
            <Switch id="section-active" checked={form.isActive} onCheckedChange={form.setIsActive} />
            <FieldLabel htmlFor="section-active">{home.form.active}</FieldLabel>
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {home.form.cancel}
            </Button>
            <Button type="submit" disabled={form.pending}>
              {form.pending && <Spinner />}
              {home.form.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
