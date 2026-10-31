import Link from "next/link";
import type { Locale } from "@nosa/contracts";
import { MediaImage } from "@/shared/components/media-image";
import { Reveal } from "@/shared/components/reveal";
import { SectionTitle } from "@/shared/components/section-title";
import { getCategoryTree } from "../../api/catalog.queries";

type CategoriesSectionProps = {
  title: string;
  /** Chosen categories in order; empty shows the top-level ones. */
  slugs: string[];
  locale: Locale;
  viewAllLabel: string;
};

/** "Shop by category": round photos with a stitched ring, as in the home design. */
export async function CategoriesSection({ title, slugs, locale, viewAllLabel }: CategoriesSectionProps) {
  const tree = await getCategoryTree();
  const chosen = slugs.length ? slugs.map((slug) => tree.find((category) => category.slug === slug)).filter((category) => !!category) : tree.slice(0, 6);
  if (!chosen.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <Reveal>
        <SectionTitle
          variant="inline"
          title={title}
          action={
            <Link href={`/${locale}/shop`} className="shrink-0 text-sm font-medium text-primary-700 hover:underline">
              {viewAllLabel}
            </Link>
          }
        />
      </Reveal>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {chosen.map((category) => (
          <li key={category.id}>
            <Link href={`/${locale}/shop/${category.slug}`} className="group flex flex-col items-center gap-3 text-center">
              <span className="stitch-soft relative block size-32 overflow-hidden rounded-[46%_54%_52%_48%/52%_46%_54%_48%] border-2 border-dashed p-2 transition-transform duration-300 group-hover:scale-105 sm:size-40">
                <span className="relative block size-full overflow-hidden rounded-[inherit] bg-muted">
                  <MediaImage image={category.image} alt={category.name[locale]} fill sizes="160px" />
                </span>
              </span>
              <span className="font-medium group-hover:text-primary-700">{category.name[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
