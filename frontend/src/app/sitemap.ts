import type { MetadataRoute } from "next";
import { LOCALES } from "@nosa/contracts";
import { getCategoryTree, listProducts } from "@/features/catalog/api/catalog.queries";
import { siteConfig } from "@/shared/config/site";

/** Home, shop, every category and product in both languages, each linking to its translation. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tree, { items }] = await Promise.all([getCategoryTree(), listProducts({ limit: 100, sort: "newest" })]);
  const paths = ["", "/shop", ...tree.map((category) => `/shop/${category.slug}`), ...items.map((product) => `/product/${product.slug}`)];

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(LOCALES.map((alt) => [alt, `${siteConfig.url}/${alt}${path}`])) },
    })),
  );
}
