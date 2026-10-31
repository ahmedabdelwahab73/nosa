"use client";

import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { useChangePasswordForm } from "./change-password-form.ux";

type ChangePasswordFormProps = {
  labels: Dictionary["dashboard"]["account"];
  invalidMessage: string;
  messages: FeedbackMessages;
};

export function ChangePasswordForm({ labels, invalidMessage, messages }: ChangePasswordFormProps) {
  const form = useChangePasswordForm({ messages, errorLabels: labels.errors, invalidMessage });

  return (
    <form onSubmit={form.submit} className="flex flex-col gap-4" noValidate>
      <TextField
        type="password"
        dir="ltr"
        autoComplete="current-password"
        label={labels.current}
        value={form.draft.currentPassword}
        onValueChange={form.set("currentPassword")}
        error={form.error("currentPassword")}
        required
      />
      <TextField
        type="password"
        dir="ltr"
        autoComplete="new-password"
        label={labels.next}
        hint={labels.hint}
        value={form.draft.newPassword}
        onValueChange={form.set("newPassword")}
        error={form.error("newPassword")}
        required
      />
      <TextField
        type="password"
        dir="ltr"
        autoComplete="new-password"
        label={labels.confirm}
        value={form.draft.confirm}
        onValueChange={form.set("confirm")}
        error={form.error("confirm")}
        required
      />
      <Button type="submit" size="xl" disabled={form.pending} className="self-start">
        {form.pending && <Spinner />}
        {labels.save}
      </Button>
    </form>
  );
}
