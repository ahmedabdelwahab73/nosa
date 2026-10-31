import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/features/catalog/components/shop-page";
import { ShopSkeleton } from "@/features/catalog/components/shop-skeleton";
import { getDictionary } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.store.searchPage.title, robots: { index: false } };
}

export default function SearchRoute({ searchParams }: PageProps<"/[locale]/search">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopPage searchParams={searchParams} search />
    </Suspense>
  );
}
