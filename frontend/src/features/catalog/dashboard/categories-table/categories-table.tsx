"use client";

import { ArrowDown, ArrowUp, FolderPlus, Pencil, Plus, Trash2 } from "lucide-react";
import type { CategoryDto, Locale } from "@nosa/contracts";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";
import type { ImageUploaderLabels } from "@/shared/components/image-uploader";
import { MediaImage } from "@/shared/components/media-image";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { CategoryDialog } from "../category-dialog";
import { categoryRows } from "../lib/category-draft";
import { useCategoriesTable } from "./categories-table.ux";

type CategoriesTableProps = {
  categories: CategoryDto[];
  locale: Locale;
  labels: Dictionary["dashboard"]["categories"];
  languages: Record<Locale, string>;
  errorLabels: Record<string, string>;
  invalidMessage: string;
  uploaderLabels: ImageUploaderLabels;
  messages: FeedbackMessages;
};

/** Indent per tree level; a class per level because Tailwind can't build class names at runtime. */
const INDENT = ["", "ms-6", "ms-12", "ms-18"] as const;

export function CategoriesTable({ categories, locale, labels, languages, errorLabels, invalidMessage, uploaderLabels, messages }: CategoriesTableProps) {
  const table = useCategoriesTable(categories, messages);
  const rows = categoryRows(categories);

  const addButton = (
    <Button size="lg" className="h-10 px-4" onClick={() => table.openDialog(null)}>
      <Plus />
      {labels.add}
    </Button>
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={labels.title} subtitle={labels.subtitle} action={addButton} />

      <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        {rows.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.columns.category}</TableHead>
                <TableHead className="hidden md:table-cell">{labels.columns.slug}</TableHead>
                <TableHead>{labels.columns.visible}</TableHead>
                <TableHead className="text-end">{labels.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ category, depth }) => {
                const name = category.name[locale];
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className={cn("flex items-center gap-3 font-medium", INDENT[Math.min(depth, INDENT.length - 1)], depth > 0 && "border-s-2 border-primary-200 ps-3")}>
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border">
                          <MediaImage image={category.image} alt="" fill sizes="48px" />
                        </span>
                        {name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell" dir="ltr">{category.slug}</TableCell>
                    <TableCell>
                      <Switch checked={category.isActive} disabled={table.pending} aria-label={`${labels.columns.visible}: ${name}`} onCheckedChange={() => table.toggleActive(category)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon-sm" title={labels.actions.moveUp} aria-label={`${labels.actions.moveUp}: ${name}`} disabled={table.pending} onClick={() => table.move(category, -1)}>
                          <ArrowUp />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title={labels.actions.moveDown} aria-label={`${labels.actions.moveDown}: ${name}`} disabled={table.pending} onClick={() => table.move(category, 1)}>
                          <ArrowDown />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title={labels.actions.addChild} aria-label={`${labels.actions.addChild}: ${name}`} onClick={() => table.openDialog(null, category.id)}>
                          <FolderPlus />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title={labels.actions.edit} aria-label={`${labels.actions.edit}: ${name}`} onClick={() => table.openDialog(category)}>
                          <Pencil />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="text-destructive" title={labels.actions.delete} aria-label={`${labels.actions.delete}: ${name}`}>
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{labels.deleteTitle}</AlertDialogTitle>
                              <AlertDialogDescription>{labels.deleteBody.replace("{name}", name)}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
                              <AlertDialogAction variant="destructive" onClick={() => table.remove(category.id)}>{labels.confirmDelete}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState illustration="empty-cart" title={labels.empty} description={labels.emptyHint} action={addButton} />
        )}
      </div>

      <CategoryDialog
        key={table.dialog.key}
        open={table.dialog.open}
        onOpenChange={table.closeDialog}
        category={table.dialog.category}
        defaultParent={table.dialog.parent}
        categories={categories}
        locale={locale}
        labels={labels.form}
        languages={languages}
        errorLabels={errorLabels}
        invalidMessage={invalidMessage}
        uploaderLabels={uploaderLabels}
        messages={messages}
      />
    </div>
  );
}
