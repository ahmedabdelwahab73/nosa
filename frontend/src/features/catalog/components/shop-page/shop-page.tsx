import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { MediaImage } from "@/shared/components/media-image";
import { Pager } from "@/shared/components/pager";
import { ProductGrid } from "@/shared/components/product-grid";
import { ThreadLine } from "@/shared/components/thread-line";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { SHOP_FILTER_KEYS, parseShopQuery, shopHref } from "../../lib/shop-query";
import { ShopFilters } from "../shop-filters";
import { ShopFiltersSheet } from "../shop-filters-sheet";
import { SortSelect } from "../sort-select";
import { getShopData } from "./shop-page.data";

type ShopPageProps = {
  /** The raw URL params; read here because they are request-time data. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  /** Route params of /shop/[slug]; omitted for the whole shop. */
  params?: Promise<{ slug: string }>;
  /** The search page: the heading shows what was searched and a search box sits above the results. */
  search?: boolean;
};

export async function ShopPage({ searchParams, params, search }: ShopPageProps) {
  const [locale, dict, rawParams, routeParams] = await Promise.all([getLocale(), getDictionary(), searchParams, params]);
  const categorySlug = routeParams?.slug;
  const query = parseShopQuery(rawParams);
  const { category, facets, list } = await getShopData(query, categorySlug);
  const t = dict.store.shop;
  const basePath = search ? `/${locale}/search` : categorySlug ? `/${locale}/shop/${categorySlug}` : `/${locale}/shop`;
  const searchLabels = dict.store.searchPage;
  const title = search ? (query.q ? searchLabels.resultsFor.replace("{q}", query.q) : searchLabels.title) : (category?.name[locale] ?? t.title);
  const description = category?.description?.[locale];

  // Active filters as removable chips (server links, no JS).
  const chips = SHOP_FILTER_KEYS.filter((key) => query.filters[key]).map((key) => {
    const value = query.filters[key]!;
    const label =
      key === "size" ? (facets.sizes.find((size) => size.value === value)?.label[locale] ?? value)
      : key === "color" ? (facets.colors.find((color) => color.value === value)?.label[locale] ?? value)
      : key === "minPrice" ? `${t.filters.min} ${value}`
      : key === "maxPrice" ? `${t.filters.max} ${value}`
      : t.filters[key];
    return { key, label };
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-primary-700">{dict.common.home}</Link>
        <span aria-hidden>/</span>
        {category ? (
          <>
            <Link href={`/${locale}/shop`} className="hover:text-primary-700">{t.breadcrumbShop}</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{title}</span>
          </>
        ) : (
          <span className="text-foreground">{t.title}</span>
        )}
      </nav>

      <header className="stitch-soft relative grid items-center overflow-hidden rounded-3xl border bg-gradient-to-br from-blush to-canvas md:grid-cols-[1.2fr_1fr]">
        <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-10">
          <h1 className="font-display text-4xl font-semibold text-primary-800 sm:text-5xl">{title}</h1>
          {description && <p className="max-w-lg text-lg text-muted-foreground">{description}</p>}
          {search && (
            <form action={`/${locale}/search`} role="search" className="flex max-w-lg gap-2">
              <input name="q" type="search" defaultValue={query.q} placeholder={dict.store.search.placeholder} aria-label={dict.store.nav.search} className="h-12 flex-1 rounded-full border bg-card px-5 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
              <Button type="submit" size="xl">{dict.store.search.submit}</Button>
            </form>
          )}
          <ThreadLine variant="heart" className="mt-2 w-40 text-primary-400" animated={false} />
        </div>
        {category?.image && (
          <span className="relative hidden aspect-[16/9] md:block md:h-full">
            <MediaImage image={category.image} alt={category.image.alt?.[locale] || title} fill sizes="40vw" />
          </span>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <aside className="stitch-soft hidden h-fit rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-24 lg:block">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <ShopFilters facets={facets} locale={locale} labels={t.filters} />
          </Suspense>
        </aside>

        <section className="flex min-w-0 flex-col gap-5" aria-label={title}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-card">
            <p className="ps-2 text-sm text-muted-foreground">{t.results.replace("{count}", String(list.meta.total))}</p>
            <div className="flex items-center gap-3">
              <Suspense fallback={<Skeleton className="h-10 w-56" />}>
                <ShopFiltersSheet facets={facets} locale={locale} labels={t.filters} />
                <SortSelect value={query.sort} label={t.sortBy} options={t.sorts} />
              </Suspense>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <Link
                    href={shopHref(basePath, query, { [chip.key]: undefined, page: undefined })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-sm text-primary-foreground"
                  >
                    {chip.label}
                    <X className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={shopHref(basePath, { ...query, filters: {} }, { page: undefined })} className="text-sm text-primary-700 hover:underline">
                  {t.filters.clear}
                </Link>
              </li>
            </ul>
          )}

          {list.items.length ? (
            <>
              <ProductGrid products={list.items} locale={locale} labels={dict.store.product} columns={3} priorityCount={3} />
              <Pager
                page={list.meta.page}
                pages={list.meta.pages}
                hrefFor={(page) => shopHref(basePath, query, { page: page > 1 ? String(page) : undefined })}
                labels={{ previous: dict.common.previous, next: dict.common.next }}
                className="pt-2"
              />
            </>
          ) : (
            <EmptyState illustration="empty-search" title={search ? searchLabels.empty : t.empty} description={search ? searchLabels.emptyText : t.emptyText} />
          )}
        </section>
      </div>
    </div>
  );
}
