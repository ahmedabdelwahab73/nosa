"use client";

import { useState, useTransition } from "react";
import type { PageDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { deletePage, savePage } from "../page-dialog/page-dialog.action";

type DialogState = { open: boolean; page: PageDto | null; key: number };

export function usePagesManager(messages: FeedbackMessages) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, page: null, key: 0 });
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  return {
    dialog,
    pending,
    openDialog: (page: PageDto | null) => setDialog((current) => ({ open: true, page, key: current.key + 1 })),
    setDialogOpen: (open: boolean) => setDialog((current) => ({ ...current, open })),
    togglePublished: (page: PageDto) =>
      startTransition(async () => {
        setResult(await savePage(false, { slug: page.slug, title: page.title, body: page.body, isPublished: !page.isPublished }));
      }),
    remove: (page: PageDto) =>
      startTransition(async () => {
        setResult(await deletePage(page.slug));
      }),
  };
}
