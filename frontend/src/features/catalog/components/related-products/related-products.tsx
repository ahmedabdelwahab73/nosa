import { ProductGrid } from "@/shared/components/product-grid";
import { Reveal } from "@/shared/components/reveal";
import { SectionTitle } from "@/shared/components/section-title";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { listRelatedProducts } from "../../api/catalog.queries";

/** "You may also like": a failure here is caught by the parent boundary, so the product page still works. */
export async function RelatedProducts({ slug }: { slug: string }) {
  const [locale, dict, products] = await Promise.all([getLocale(), getDictionary(), listRelatedProducts(slug)]);
  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-6">
      <Reveal>
        <SectionTitle variant="inline" title={dict.store.product.related} />
      </Reveal>
      <ProductGrid products={products.slice(0, 4)} locale={locale} labels={dict.store.product} />
    </section>
  );
}
