"use client";

import { useOptimistic, useState, useTransition } from "react";
import type { DashboardProductListItem, ProductStatus } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { deleteProduct, duplicateProduct, setProductsStatus } from "./products-table.action";

export function useProductsTable(items: DashboardProductListItem[], messages: FeedbackMessages) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<ProductStatus | "">("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  // The switch flips immediately; the server result (or an error) settles it when the transition ends.
  const [optimistic, setOptimistic] = useOptimistic(
    Object.fromEntries(items.map((item) => [item.id, item.status])) as Record<string, ProductStatus>,
    (state, change: { ids: string[]; status: ProductStatus }) => ({
      ...state,
      ...Object.fromEntries(change.ids.map((id) => [id, change.status])),
    }),
  );

  const run = (task: () => Promise<ActionState>) =>
    startTransition(async () => {
      setResult(await task());
    });

  const changeStatus = (ids: string[], status: ProductStatus) =>
    run(async () => {
      setOptimistic({ ids, status });
      const outcome = await setProductsStatus(ids, status);
      if (outcome.ok) setSelected(new Set());
      return outcome;
    });

  const allSelected = items.length > 0 && selected.size === items.length;

  return {
    pending,
    statusOf: (id: string) => optimistic[id] ?? "draft",
    selected,
    allSelected,
    toggleAll: () => setSelected(allSelected ? new Set() : new Set(items.map((item) => item.id))),
    toggleOne: (id: string) =>
      setSelected((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
    bulkStatus,
    setBulkStatus,
    applyBulk: () => bulkStatus && changeStatus([...selected], bulkStatus),
    togglePublished: (id: string, published: boolean) => changeStatus([id], published ? "published" : "draft"),
    duplicate: (id: string) => run(() => duplicateProduct(id)),
    remove: (id: string) => run(() => deleteProduct(id)),
  };
}
