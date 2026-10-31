"use client";

import { DASHBOARD_ROLES, type StaffMemberDto, type UserRole } from "@nosa/contracts";
import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { draftFromMember, emptyStaffDraft } from "../../lib/staff-draft";
import { useStaffDialog } from "./staff-dialog.ux";

type StaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The member being edited; null adds a new one. */
  member: StaffMemberDto | null;
  /** Only an owner may hand out the owner role. */
  actorRole: UserRole;
  labels: Dictionary["dashboard"]["team"];
  roleLabels: Record<UserRole, string>;
  invalidMessage: string;
  messages: FeedbackMessages;
};

/** Mounted fresh for every open (the parent keys it), so the form always starts from the right values. */
export function StaffDialog({ open, onOpenChange, member, actorRole, labels, roleLabels, invalidMessage, messages }: StaffDialogProps) {
  const form = useStaffDialog({
    memberId: member?.id ?? null,
    initial: member ? draftFromMember(member) : emptyStaffDraft(),
    messages,
    errorLabels: labels.errors,
    invalidMessage,
    onSaved: () => onOpenChange(false),
  });
  const { draft, update, error } = form;
  const roles = DASHBOARD_ROLES.filter((role) => role !== "owner" || actorRole === "owner");
  const f = labels.form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary-800">{member ? f.titleEdit : f.titleNew}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.submit} className="flex flex-col gap-4" noValidate>
          <TextField label={f.name} required value={draft.name} onValueChange={(name) => update({ name })} error={error("name")} disabled={!!member} />
          <TextField
            label={f.phone}
            required
            dir="ltr"
            inputMode="tel"
            placeholder="01012345678"
            value={draft.phone}
            onValueChange={(phone) => update({ phone })}
            error={error("phone")}
            hint={member ? f.phoneLocked : undefined}
            disabled={!!member}
          />
          <Field>
            <FieldLabel>{f.role}</FieldLabel>
            <Select value={draft.role} onValueChange={(role) => update({ role: role as typeof draft.role })}>
              <SelectTrigger className="w-full bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>{labels.roleHints[draft.role]}</FieldDescription>
          </Field>
          <TextField
            dir="ltr"
            autoComplete="off"
            label={f.password}
            required={!member}
            value={draft.password}
            onValueChange={(password) => update({ password })}
            error={error("password")}
            hint={member ? f.passwordEdit : f.passwordNew}
          />
          {member && (
            <Field orientation="horizontal" className="items-center">
              <Switch id="staff-active" checked={draft.isActive} onCheckedChange={(isActive) => update({ isActive })} />
              <FieldLabel htmlFor="staff-active">{f.active}</FieldLabel>
            </Field>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{f.cancel}</Button>
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
