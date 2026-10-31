import { connection } from "next/server";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pager } from "@/shared/components/pager";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { formatNumber } from "@/shared/lib/format";
import { CustomersSearch } from "../customers-search";
import { CustomersTable } from "../customers-table";
import { listCustomers, parseCustomersQuery } from "./customers-list.data";

type CustomersListProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function CustomersList({ searchParams }: CustomersListProps) {
  await connection();
  const [locale, dict, params] = await Promise.all([getLocale(), getDictionary(), searchParams]);
  const query = parseCustomersQuery(params);
  const { items, meta } = await listCustomers(query);
  const t = dict.dashboard.customers;
  const base = `/${locale}/dashboard/customers`;

  const hrefFor = (page: number) => {
    const next = new URLSearchParams();
    if (query.q) next.set("q", query.q);
    if (page > 1) next.set("page", String(page));
    const search = next.toString();
    return search ? `${base}?${search}` : base;
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <CustomersSearch placeholder={t.search} />

        {items.length ? (
          <>
            <CustomersTable items={items} locale={locale} labels={t} />
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
        ) : query.q ? (
          <EmptyState illustration="empty-search" title={t.emptyFiltered} />
        ) : (
          <EmptyState illustration="empty-cart" title={t.empty} description={t.emptyHint} />
        )}
      </div>
    </div>
  );
}
