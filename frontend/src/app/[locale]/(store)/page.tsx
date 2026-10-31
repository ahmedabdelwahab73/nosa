import { CategoryStrip } from "@/features/catalog/components/category-strip";
import { CategoriesSection } from "@/features/catalog/components/categories-section";
import { ProductsSection } from "@/features/catalog/components/products-section";
import { getHomeSections } from "@/features/cms/api/cms.queries";
import { BannerSection } from "@/features/cms/components/banner-section";
import { HeroSection } from "@/features/cms/components/hero-section";
import { RichTextSection } from "@/features/cms/components/rich-text-section";
import { defaultHomeSections, type RenderableSection } from "@/features/cms/lib/home-sections";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { getDictionary, getLocale, loadDictionary } from "@/shared/i18n/get-dictionary";

/** Home = the sections the owner arranged in the dashboard (or the built-in set until she does). */
export default async function HomePage() {
  const [locale, dict, saved, ar, en] = await Promise.all([getLocale(), getDictionary(), getHomeSections(), loadDictionary("ar"), loadDictionary("en")]);
  const sections: RenderableSection[] = saved.length ? saved : defaultHomeSections({ ar, en });
  const errorLabels = { title: dict.errors.pageTitle, text: dict.errors.pageText, retry: dict.errors.retry, requestId: dict.errors.requestId };

  return (
    <div className="flex flex-col gap-12 pb-4 sm:gap-16">
      <ErrorBoundary labels={errorLabels} compact>
        <CategoryStrip locale={locale} label={dict.home.categoryStrip} />
      </ErrorBoundary>
      {sections.map(({ id, content, illustration }) => (
        // One failing section never takes the whole home page down.
        <ErrorBoundary key={id} labels={errorLabels} compact>
          {content.type === "hero" && <HeroSection content={content} locale={locale} eyebrow={dict.home.defaults.eyebrow} />}
          {content.type === "categories" && (
            <CategoriesSection title={content.title[locale]} slugs={content.categorySlugs} locale={locale} viewAllLabel={dict.common.viewAll} />
          )}
          {content.type === "products" && (
            <ProductsSection title={content.title[locale]} source={content.source} categorySlug={content.categorySlug} limit={content.limit} locale={locale} dict={dict} />
          )}
          {content.type === "banner" && <BannerSection content={content} locale={locale} illustration={illustration} />}
          {content.type === "richText" && <RichTextSection content={content} locale={locale} illustration={illustration} />}
        </ErrorBoundary>
      ))}
    </div>
  );
}
