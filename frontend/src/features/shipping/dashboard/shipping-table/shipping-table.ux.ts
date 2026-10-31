"use client";

import { useState, useTransition } from "react";
import type { GovernorateDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { saveShippingRate } from "./shipping-table.action";

type RowDraft = { fee: string; min: string; max: string; isActive: boolean };

const toDraft = (rate: GovernorateDto): RowDraft => ({
  fee: String(rate.fee),
  min: String(rate.estimatedDays.min),
  max: String(rate.estimatedDays.max),
  isActive: rate.isActive,
});

/** One editable draft per governorate; only rows that differ from the saved value can be saved. */
export function useShippingTable(rates: GovernorateDto[], messages: FeedbackMessages) {
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>(() => Object.fromEntries(rates.map((rate) => [rate.code, toDraft(rate)])));
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  const saved = Object.fromEntries(rates.map((rate) => [rate.code, toDraft(rate)]));
  const draftOf = (code: string) => drafts[code] ?? saved[code];

  return {
    draftOf,
    savingCode,
    isDirty: (code: string) => JSON.stringify(draftOf(code)) !== JSON.stringify(saved[code]),
    change: (code: string, change: Partial<RowDraft>) => setDrafts((current) => ({ ...current, [code]: { ...draftOf(code), ...change } })),
    save: (code: string) => {
      const draft = draftOf(code);
      setSavingCode(code);
      startTransition(async () => {
        setResult(
          await saveShippingRate(code, {
            fee: Number(draft.fee),
            estimatedDays: { min: Number(draft.min), max: Number(draft.max) },
            isActive: draft.isActive,
          }),
        );
        setSavingCode(null);
      });
    },
  };
}
