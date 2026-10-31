"use client";

import { useState, useTransition } from "react";
import type { StaffMemberDto } from "@nosa/contracts";
import { useActionFeedback, type FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { ActionState } from "@/shared/lib/action-state";
import { saveStaff } from "../staff-dialog/staff-dialog.action";

type DialogState = { open: boolean; member: StaffMemberDto | null; key: number };

export function useTeamTable(messages: FeedbackMessages) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, member: null, key: 0 });
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);
  useActionFeedback(result, messages);

  return {
    dialog,
    pending,
    openDialog: (member: StaffMemberDto | null) => setDialog((current) => ({ open: true, member, key: current.key + 1 })),
    setDialogOpen: (open: boolean) => setDialog((current) => ({ ...current, open })),
    toggleActive: (member: StaffMemberDto) =>
      startTransition(async () => {
        setResult(await saveStaff(member.id, { isActive: !member.isActive }));
      }),
  };
}
