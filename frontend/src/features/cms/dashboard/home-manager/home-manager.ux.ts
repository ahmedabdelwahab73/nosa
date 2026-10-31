"use client";

import { useOptimistic, useState, useTransition } from "react";
import type { HomeSectionDto, HomeSectionType } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { removeSection, reorderSections, saveSection, seedDefaultSections } from "./home-manager.action";

type DialogState = { open: boolean; section: HomeSectionDto | null; type: HomeSectionType; key: number };

export function useHomeManager(sections: HomeSectionDto[], messages: FeedbackMessages) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, section: null, type: "banner", key: 0 });
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  // The list moves the moment a button is pressed; the server result settles it when the transition ends.
  const [ordered, setOrdered] = useOptimistic(sections, (_current, ids: string[]) =>
    ids.map((id) => sections.find((section) => section.id === id)).filter((section) => !!section),
  );

  const run = (task: () => Promise<ActionState>) =>
    startTransition(async () => {
      setResult(await task());
    });

  return {
    sections: ordered,
    dialog,
    pending,
    openDialog: (section: HomeSectionDto | null, type: HomeSectionType = "banner") =>
      setDialog((current) => ({ open: true, section, type: section?.content.type ?? type, key: current.key + 1 })),
    setDialogOpen: (open: boolean) => setDialog((current) => ({ ...current, open })),
    move: (index: number, step: -1 | 1) =>
      run(async () => {
        const ids = ordered.map((section) => section.id);
        const target = index + step;
        if (target < 0 || target >= ids.length) return { ok: true, event: "updated" } as ActionState;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        setOrdered(ids);
        return reorderSections(ids);
      }),
    toggle: (section: HomeSectionDto) => run(() => saveSection(section.id, { content: section.content, isActive: !section.isActive })),
    remove: (section: HomeSectionDto) => run(() => removeSection(section.id)),
    seed: () => run(seedDefaultSections),
  };
}
