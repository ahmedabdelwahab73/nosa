"use client";

import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import type { Locale, PageDto } from "@nosa/contracts";
import { EmptyState } from "@/shared/components/empty-state";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatDate } from "@/shared/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { PageDialog } from "../page-dialog";
import { usePagesManager } from "./pages-manager.ux";

type PagesManagerProps = {
  pages: PageDto[];
  locale: Locale;
  labels: Dictionary["dashboard"]["content"];
  languages: Record<Locale, string>;
  invalidMessage: string;
  messages: FeedbackMessages;
};

export function PagesManager({ pages, locale, labels, languages, invalidMessage, messages }: PagesManagerProps) {
  const manager = usePagesManager(messages);
  const t = labels.pages;

  const addButton = (
    <Button size="lg" className="h-10 px-4" onClick={() => manager.openDialog(null)}>
      <Plus />
      {t.add}
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">{t.hint}</p>
        {addButton}
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        {pages.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.columns.title}</TableHead>
                <TableHead className="hidden sm:table-cell">{t.columns.slug}</TableHead>
                <TableHead className="hidden md:table-cell">{t.columns.updated}</TableHead>
                <TableHead>{t.columns.status}</TableHead>
                <TableHead className="text-end">{t.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.slug}>
                  <TableCell className="font-medium">{page.title[locale]}</TableCell>
                  <TableCell dir="ltr" className="hidden text-start text-muted-foreground sm:table-cell">
                    {page.slug}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{formatDate(page.updatedAt, locale)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={page.isPublished} disabled={manager.pending} onCheckedChange={() => manager.togglePublished(page)} aria-label={page.isPublished ? t.published : t.draft} />
                      <span className="text-sm text-muted-foreground">{page.isPublished ? t.published : t.draft}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      {page.isPublished && (
                        <Button asChild variant="ghost" size="icon-sm" title={t.view} aria-label={`${t.view}: ${page.title[locale]}`}>
                          <Link href={`/${locale}/pages/${page.slug}`} target="_blank">
                            <ExternalLink />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" title={t.form.titleEdit} aria-label={`${t.form.titleEdit}: ${page.title[locale]}`} onClick={() => manager.openDialog(page)}>
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="text-destructive" title={t.delete.action} aria-label={`${t.delete.action}: ${page.title[locale]}`}>
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.delete.title.replace("{title}", page.title[locale])}</AlertDialogTitle>
                            <AlertDialogDescription>{t.delete.text}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.delete.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => manager.remove(page)}>{t.delete.confirm}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState illustration="empty-search" title={t.empty} description={t.emptyHint} action={addButton} />
        )}
      </div>

      <PageDialog
        key={manager.dialog.key}
        open={manager.dialog.open}
        onOpenChange={manager.setDialogOpen}
        page={manager.dialog.page}
        labels={labels}
        languages={languages}
        invalidMessage={invalidMessage}
        messages={messages}
      />
    </div>
  );
}
