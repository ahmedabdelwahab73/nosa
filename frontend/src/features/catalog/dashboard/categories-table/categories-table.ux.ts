"use client";

import { useState, useTransition } from "react";
import type { CategoryDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { saveCategory } from "../category-dialog/category-dialog.action";
import { draftFromCategory, toCategoryInput } from "../lib/category-draft";
import { deleteCategory, reorderCategories } from "./categories-table.action";

type DialogState = { open: boolean; category: CategoryDto | null; parent: string; key: number };

export function useCategoriesTable(categories: CategoryDto[], messages: FeedbackMessages) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, category: null, parent: "", key: 0 });
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  const run = (task: () => Promise<ActionState>) =>
    startTransition(async () => {
      setResult(await task());
    });

  const openDialog = (category: CategoryDto | null, parent = "") =>
    setDialog((current) => ({ open: true, category, parent, key: current.key + 1 }));

  /** Swaps a category with the sibling above/below it and sends the whole new order. */
  const move = (category: CategoryDto, direction: -1 | 1) => {
    const ordered = [...categories].sort((a, b) => a.order - b.order);
    const siblings = ordered.filter((c) => c.parent === category.parent);
    const target = siblings[siblings.indexOf(category) + direction];
    if (!target) return;
    const ids = ordered.map((c) => c.id);
    const a = ids.indexOf(category.id);
    const b = ids.indexOf(target.id);
    [ids[a], ids[b]] = [ids[b]!, ids[a]!];
    run(() => reorderCategories(ids));
  };

  return {
    dialog,
    pending,
    openDialog,
    closeDialog: (open: boolean) => setDialog((current) => ({ ...current, open })),
    move,
    toggleActive: (category: CategoryDto) =>
      run(() => saveCategory(category.id, toCategoryInput({ ...draftFromCategory(category), isActive: !category.isActive }))),
    remove: (id: string) => run(() => deleteCategory(id)),
  };
}
