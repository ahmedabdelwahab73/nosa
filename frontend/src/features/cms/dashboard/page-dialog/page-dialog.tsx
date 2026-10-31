"use client";

import type { Locale, PageDto } from "@nosa/contracts";
import { LocalizedInput } from "@/shared/components/localized-input";
import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { usePageDialog } from "./page-dialog.ux";

type PageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The page being edited; null adds a new one. */
  page: PageDto | null;
  labels: Dictionary["dashboard"]["content"];
  languages: Record<Locale, string>;
  invalidMessage: string;
  messages: FeedbackMessages;
};

/** Mounted fresh for every open (the parent keys it), so the form always starts from the right values. */
export function PageDialog({ open, onOpenChange, page, labels, languages, invalidMessage, messages }: PageDialogProps) {
  const form = usePageDialog({ page, messages, errorLabels: labels.errors, invalidMessage, onSaved: () => onOpenChange(false) });
  const { draft, update, error } = form;
  const f = labels.pages.form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary-800">{page ? f.titleEdit : f.titleNew}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.submit} className="flex flex-col gap-4" noValidate>
          <TextField
            label={f.slug}
            required
            dir="ltr"
            placeholder="shipping-returns"
            value={draft.slug}
            onValueChange={(slug) => update({ slug: slug.toLowerCase() })}
            error={error("slug")}
            hint={page ? f.slugLocked : f.slugHint}
            disabled={!!page}
          />
          <LocalizedInput
            label={f.title}
            required
            value={draft.title}
            onChange={(title) => update({ title })}
            languageLabels={languages}
            errors={{ ar: error("title.ar"), en: error("title.en") }}
            maxLength={80}
          />
          <LocalizedInput
            label={f.body}
            required
            multiline
            value={draft.body}
            onChange={(body) => update({ body })}
            languageLabels={languages}
            errors={{ ar: error("body.ar"), en: error("body.en") }}
            maxLength={8000}
          />
          <p className="text-xs text-muted-foreground">{f.bodyHint}</p>
          <Field orientation="horizontal" className="items-center">
            <Switch id="page-published" checked={draft.isPublished} onCheckedChange={(isPublished) => update({ isPublished })} />
            <FieldLabel htmlFor="page-published">{f.published}</FieldLabel>
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {f.cancel}
            </Button>
            <Button type="submit" disabled={form.pending}>
              {form.pending && <Spinner />}
              {f.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
