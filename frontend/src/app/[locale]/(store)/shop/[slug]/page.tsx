import { Suspense } from "react";
import type { Metadata } from "next";
import { LOCALES } from "@nosa/contracts";
import { getCategory, getCategoryTree } from "@/features/catalog/api/catalog.queries";
import { ShopPage } from "@/features/catalog/components/shop-page";
import { ShopSkeleton } from "@/features/catalog/components/shop-skeleton";
import { getLocale } from "@/shared/i18n/get-dictionary";

export async function generateStaticParams() {
  const tree = await getCategoryTree();
  return LOCALES.flatMap((locale) => tree.map((category) => ({ locale, slug: category.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/shop/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.seo?.title?.[locale] || category.name[locale],
    description: category.seo?.description?.[locale] || category.description?.[locale],
  };
}

export default function CategoryRoute({ params, searchParams }: PageProps<"/[locale]/shop/[slug]">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopPage searchParams={searchParams} params={params} />
    </Suspense>
  );
}
