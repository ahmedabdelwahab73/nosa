import { connection } from "next/server";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pager } from "@/shared/components/pager";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { formatNumber } from "@/shared/lib/format";
import { OrdersFilters } from "../orders-filters";
import { OrdersTable } from "../orders-table";
import { listDashboardOrders, parseOrdersQuery } from "./orders-list.data";

type OrdersListProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function OrdersList({ searchParams }: OrdersListProps) {
  await connection();
  const [locale, dict, params] = await Promise.all([getLocale(), getDictionary(), searchParams]);
  const query = parseOrdersQuery(params);
  const { items, meta } = await listDashboardOrders(query);
  const t = dict.dashboard.orders;
  const filtered = Boolean(query.q || query.status || query.paymentMethod);
  const base = `/${locale}/dashboard/orders`;

  const hrefFor = (page: number) => {
    const next = new URLSearchParams();
    if (query.q) next.set("q", query.q);
    if (query.status) next.set("status", query.status);
    if (query.paymentMethod) next.set("paymentMethod", query.paymentMethod);
    if (page > 1) next.set("page", String(page));
    const search = next.toString();
    return search ? `${base}?${search}` : base;
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <OrdersFilters labels={t} orderStatus={dict.orderStatus} />

        {items.length ? (
          <>
            <OrdersTable items={items} locale={locale} labels={t} orderStatus={dict.orderStatus} />
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
          <EmptyState illustration="empty-cart" title={t.empty} description={t.emptyHint} />
        )}
      </div>
    </div>
  );
}
