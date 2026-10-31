"use client";

import Link from "next/link";
import { Copy, Pencil, Trash2 } from "lucide-react";
import type { DashboardProductListItem, Locale } from "@nosa/contracts";
import { MediaImage } from "@/shared/components/media-image";
import { Price } from "@/shared/components/price";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatNumber } from "@/shared/lib/format";
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
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useProductsTable } from "./products-table.ux";

type ProductsTableProps = {
  items: DashboardProductListItem[];
  locale: Locale;
  labels: Dictionary["dashboard"]["products"];
  messages: FeedbackMessages;
  /** Only admins and owners may delete; editors can still archive. */
  canDelete: boolean;
};

export function ProductsTable({ items, locale, labels, messages, canDelete }: ProductsTableProps) {
  const table = useProductsTable(items, messages);
  const editHref = (id: string) => `/${locale}/dashboard/products/${id}`;

  return (
    <div className="flex flex-col gap-3">
      {table.selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-primary-50 px-4 py-3">
          <span className="text-sm font-medium text-primary-800">
            {labels.bulk.selected.replace("{count}", formatNumber(table.selected.size, locale))}
          </span>
          <Select value={table.bulkStatus} onValueChange={(value) => table.setBulkStatus(value as typeof table.bulkStatus)}>
            <SelectTrigger className="w-48 bg-card">
              <SelectValue placeholder={labels.bulk.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">{labels.bulk.publish}</SelectItem>
              <SelectItem value="draft">{labels.bulk.draft}</SelectItem>
              <SelectItem value="archived">{labels.bulk.archive}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={table.applyBulk} disabled={!table.bulkStatus || table.pending}>
            {table.pending && <Spinner />}
            {labels.bulk.apply}
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={table.allSelected} onCheckedChange={table.toggleAll} aria-label={labels.actions.selectAll} />
            </TableHead>
            <TableHead>{labels.columns.product}</TableHead>
            <TableHead className="hidden lg:table-cell">{labels.columns.category}</TableHead>
            <TableHead>{labels.columns.price}</TableHead>
            <TableHead className="hidden sm:table-cell">{labels.columns.stock}</TableHead>
            <TableHead>{labels.columns.status}</TableHead>
            <TableHead className="text-end">{labels.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => {
            const name = product.name[locale];
            const status = table.statusOf(product.id);
            return (
              <TableRow key={product.id} data-state={table.selected.has(product.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={table.selected.has(product.id)}
                    onCheckedChange={() => table.toggleOne(product.id)}
                    aria-label={`${labels.actions.selectRow}: ${name}`}
                  />
                </TableCell>
                <TableCell>
                  <Link href={editHref(product.id)} className="flex items-center gap-3 font-medium hover:text-primary">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl border">
                      <MediaImage image={product.image} alt="" fill sizes="56px" />
                    </span>
                    <span className="flex flex-col gap-1">
                      {name}
                      <span className="flex flex-wrap gap-1">
                        {product.salePrice !== undefined && <Badge variant="secondary">{labels.badges.sale}</Badge>}
                        {product.isFeatured && <Badge variant="secondary">{labels.badges.featured}</Badge>}
                      </span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary">{product.category.name[locale]}</Badge>
                </TableCell>
                <TableCell>
                  <Price amount={product.salePrice ?? product.price} compareAt={product.salePrice ? product.price : undefined} locale={locale} size="sm" />
                </TableCell>
                <TableCell className="hidden tabular-nums sm:table-cell">
                  {product.inStock ? formatNumber(product.totalStock, locale) : <Badge variant="destructive">{labels.badges.outOfStock}</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={status === "published"}
                      onCheckedChange={(checked) => table.togglePublished(product.id, checked)}
                      aria-label={`${labels.columns.status}: ${name}`}
                    />
                    <span className="hidden text-xs text-muted-foreground xl:inline">{labels.status[status]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" title={labels.actions.edit}>
                      <Link href={editHref(product.id)} aria-label={`${labels.actions.edit}: ${name}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={labels.actions.duplicate}
                      aria-label={`${labels.actions.duplicate}: ${name}`}
                      disabled={table.pending}
                      onClick={() => table.duplicate(product.id)}
                    >
                      <Copy />
                    </Button>
                    {canDelete && (
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
                            <AlertDialogAction variant="destructive" onClick={() => table.remove(product.id)}>
                              {labels.confirmDelete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
