"use client";

import type { DashboardOrderDto, Locale } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatDate } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { Textarea } from "@/shared/ui/textarea";
import { useOrderNotes } from "./order-notes.ux";

type OrderNotesProps = {
  orderId: string;
  notes: DashboardOrderDto["internalNotes"];
  locale: Locale;
  labels: Dictionary["dashboard"]["orders"]["detail"]["notes"];
  messages: FeedbackMessages;
};

export function OrderNotes({ orderId, notes, locale, labels, messages }: OrderNotesProps) {
  const form = useOrderNotes(orderId, messages);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{labels.hint}</p>
      {notes.length ? (
        <ul className="flex flex-col gap-2">
          {notes.map((note, index) => (
            <li key={index} className="rounded-xl bg-muted px-3 py-2 text-sm">
              <p>{note.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {note.by?.name} · {formatDate(note.at, locale)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.empty}</p>
      )}
      <Textarea rows={2} maxLength={1000} placeholder={labels.placeholder} aria-label={labels.placeholder} value={form.note} onChange={(event) => form.setNote(event.target.value)} />
      <Button variant="outline" onClick={form.add} disabled={!form.note.trim() || form.pending}>
        {form.pending && <Spinner />}
        {labels.add}
      </Button>
    </div>
  );
}
