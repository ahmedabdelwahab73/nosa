import { Suspense } from "react";
import type { Metadata } from "next";
import { LOCALES } from "@nosa/contracts";
import { getProduct, listProducts } from "@/features/catalog/api/catalog.queries";
import { ProductPage } from "@/features/catalog/components/product-page";
import { addToCart } from "@/features/cart/actions/cart.action";
import { getLocale } from "@/shared/i18n/get-dictionary";
import { Skeleton } from "@/shared/ui/skeleton";

/** The newest products are prerendered at build time; any other slug is rendered on first visit and cached. */
export async function generateStaticParams() {
  const { items } = await listProducts({ limit: 24, sort: "popular" });
  return LOCALES.flatMap((locale) => items.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/product/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const product = await getProduct(slug);
  if (!product) return {};
  const title = product.seo?.title?.[locale] || product.name[locale];
  const description = product.seo?.description?.[locale] || product.description[locale].slice(0, 160);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function ProductRoute({ params }: PageProps<"/[locale]/product/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-6 h-[40rem] w-full max-w-7xl rounded-3xl" />}>
      <ProductPage params={params} addToCart={addToCart} />
    </Suspense>
  );
}
