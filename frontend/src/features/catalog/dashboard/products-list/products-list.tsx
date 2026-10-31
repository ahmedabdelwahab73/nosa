import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { Pager } from "@/shared/components/pager";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { getSession } from "@/shared/lib/auth";
import { formatNumber } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { ProductsFilters } from "../products-filters";
import { ProductsTable } from "../products-table";
import { listDashboardProducts, parseProductsQuery } from "./products-list.data";

type ProductsListProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function ProductsList({ searchParams }: ProductsListProps) {
  await connection();
  const [locale, dict, messages, params, user] = await Promise.all([
    getLocale(),
    getDictionary(),
    getFeedbackMessages(),
    searchParams,
    getSession(),
  ]);
  const query = parseProductsQuery(params);
  const { items, meta, categories } = await listDashboardProducts(query);
  const t = dict.dashboard.products;
  const filtered = Boolean(query.q || query.status || query.category);
  const base = `/${locale}/dashboard/products`;

  const hrefFor = (page: number) => {
    const next = new URLSearchParams();
    if (query.q) next.set("q", query.q);
    if (query.status) next.set("status", query.status);
    if (query.category) next.set("category", query.category);
    if (page > 1) next.set("page", String(page));
    const search = next.toString();
    return search ? `${base}?${search}` : base;
  };

  const addButton = (
    <Button asChild size="lg" className="h-10 px-4">
      <Link href={`${base}/new`}>
        <Plus />
        {t.add}
      </Link>
    </Button>
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} action={addButton} />

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <ProductsFilters locale={locale} labels={t} categories={categories} />

        {items.length ? (
          <>
            <ProductsTable
              items={items}
              locale={locale}
              labels={t}
              messages={messages}
              canDelete={user?.role === "admin" || user?.role === "owner"}
            />
            <footer className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>
                {t.pagination.summary
                  .replace("{from}", formatNumber((meta.page - 1) * meta.limit + 1, locale))
                  .replace("{to}", formatNumber((meta.page - 1) * meta.limit + items.length, locale))
                  .replace("{total}", formatNumber(meta.total, locale))}
              </span>
              <Pager page={meta.page} pages={meta.pages} hrefFor={hrefFor} labels={t.pagination} />
            </footer>
          </>
        ) : filtered ? (
          <EmptyState illustration="empty-search" title={t.emptyFiltered} />
        ) : (
          <EmptyState illustration="empty-cart" title={t.empty} description={t.emptyHint} action={addButton} />
        )}
      </div>
    </div>
  );
}
