"use client";

import { Pencil, Plus } from "lucide-react";
import type { Locale, StaffMemberDto, UserRole } from "@nosa/contracts";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatDate } from "@/shared/lib/format";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { StaffDialog } from "../staff-dialog";
import { useTeamTable } from "./team-table.ux";

type TeamTableProps = {
  members: StaffMemberDto[];
  currentUserId: string;
  actorRole: UserRole;
  locale: Locale;
  labels: Dictionary["dashboard"]["team"];
  roleLabels: Record<UserRole, string>;
  invalidMessage: string;
  messages: FeedbackMessages;
};

export function TeamTable({ members, currentUserId, actorRole, locale, labels, roleLabels, invalidMessage, messages }: TeamTableProps) {
  const table = useTeamTable(messages);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={labels.title}
        subtitle={labels.subtitle}
        action={
          <Button size="lg" className="h-10 px-4" onClick={() => table.openDialog(null)}>
            <Plus />
            {labels.add}
          </Button>
        }
      />

      <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        {members.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.columns.member}</TableHead>
                <TableHead>{labels.columns.role}</TableHead>
                <TableHead className="hidden md:table-cell">{labels.columns.lastLogin}</TableHead>
                <TableHead>{labels.columns.status}</TableHead>
                <TableHead className="text-end">{labels.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isSelf = member.id === currentUserId;
                // Admins can't touch an owner; nobody changes their own role or status here.
                const locked = isSelf || (member.role === "owner" && actorRole !== "owner");
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary-100 font-medium text-primary-800">{member.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {member.name}
                            {isSelf && <span className="ms-2 text-xs text-muted-foreground">({labels.you})</span>}
                          </span>
                          <span dir="ltr" className="text-start text-xs text-muted-foreground">{member.phone}</span>
                          {member.mustChangePassword && <span className="text-xs text-warning">{labels.mustChange}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{roleLabels[member.role]}</Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {member.lastLoginAt ? formatDate(member.lastLoginAt, locale) : labels.never}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.isActive}
                          disabled={locked || table.pending}
                          onCheckedChange={() => table.toggleActive(member)}
                          aria-label={member.isActive ? labels.active : labels.disabled}
                        />
                        <span className="text-sm text-muted-foreground">{member.isActive ? labels.active : labels.disabled}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-end">
                      {!locked && (
                        <Button variant="ghost" size="icon-sm" title={labels.form.titleEdit} aria-label={`${labels.form.titleEdit}: ${member.name}`} onClick={() => table.openDialog(member)}>
                          <Pencil />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState illustration="empty-search" title={labels.empty} />
        )}
      </div>

      <StaffDialog
        key={table.dialog.key}
        open={table.dialog.open}
        onOpenChange={table.setDialogOpen}
        member={table.dialog.member}
        actorRole={actorRole}
        labels={labels}
        roleLabels={roleLabels}
        invalidMessage={invalidMessage}
        messages={messages}
      />
    </div>
  );
}
