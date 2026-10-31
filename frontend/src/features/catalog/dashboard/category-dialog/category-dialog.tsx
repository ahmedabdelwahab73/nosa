"use client";

import type { CategoryDto, Locale } from "@nosa/contracts";
import { ImageUploader, type ImageUploaderLabels } from "@/shared/components/image-uploader";
import { LocalizedInput } from "@/shared/components/localized-input";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { descendantIds, draftFromCategory, emptyCategoryDraft } from "../lib/category-draft";
import { useCategoryDialog } from "./category-dialog.ux";

const NO_PARENT = "none";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The category being edited; null creates a new one. */
  category: CategoryDto | null;
  /** Pre-selected parent when adding a subcategory. */
  defaultParent: string;
  categories: CategoryDto[];
  locale: Locale;
  labels: Dictionary["dashboard"]["categories"]["form"];
  languages: Record<Locale, string>;
  errorLabels: Record<string, string>;
  invalidMessage: string;
  uploaderLabels: ImageUploaderLabels;
  messages: FeedbackMessages;
};

/** Mounted fresh for every open (the parent keys it), so the form always starts from the right values. */
export function CategoryDialog({ open, onOpenChange, category, defaultParent, categories, locale, labels, languages, errorLabels, invalidMessage, uploaderLabels, messages }: CategoryDialogProps) {
  const form = useCategoryDialog({
    categoryId: category?.id ?? null,
    initial: category ? draftFromCategory(category) : emptyCategoryDraft(defaultParent),
    messages,
    errorLabels,
    invalidMessage,
    onSaved: () => onOpenChange(false),
  });
  const { draft, update, error } = form;
  const blocked = category ? descendantIds(categories, category.id) : new Set<string>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary-800">{category ? labels.titleEdit : labels.titleNew}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.submit} className="flex flex-col gap-4" noValidate>
          <LocalizedInput
            label={labels.name}
            required
            value={draft.name}
            onChange={(name) => update((d) => ({ ...d, name }))}
            languageLabels={languages}
            errors={{ ar: error("name.ar"), en: error("name.en") }}
          />
          <LocalizedInput
            label={labels.description}
            multiline
            value={draft.description}
            onChange={(description) => update((d) => ({ ...d, description }))}
            languageLabels={languages}
          />
          <Field>
            <FieldLabel>{labels.parent}</FieldLabel>
            <Select value={draft.parent || NO_PARENT} onValueChange={(value) => update((d) => ({ ...d, parent: value === NO_PARENT ? "" : value }))}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>{labels.noParent}</SelectItem>
                {categories.filter((c) => !blocked.has(c.id)).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name[locale]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field data-invalid={!!error("slug")}>
            <FieldLabel htmlFor="category-slug">{labels.slug}</FieldLabel>
            <Input id="category-slug" dir="ltr" value={draft.slug} aria-invalid={!!error("slug")} onChange={(event) => update((d) => ({ ...d, slug: event.target.value.toLowerCase() }))} />
            <FieldDescription>{labels.slugHint}</FieldDescription>
            {error("slug") && <FieldError>{error("slug")}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>{labels.image}</FieldLabel>
            <ImageUploader folder="categories" value={draft.image} onChange={(image) => update((d) => ({ ...d, image }))} maxFiles={1} labels={uploaderLabels} feedback={messages} />
          </Field>
          <Field orientation="horizontal" className="items-center">
            <Switch id="category-active" checked={draft.isActive} onCheckedChange={(isActive) => update((d) => ({ ...d, isActive }))} />
            <FieldLabel htmlFor="category-active">{labels.visible}</FieldLabel>
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{labels.cancel}</Button>
            <Button type="submit" disabled={form.pending}>
              {form.pending && <Spinner />}
              {labels.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
