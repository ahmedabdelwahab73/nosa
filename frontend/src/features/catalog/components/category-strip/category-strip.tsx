import Link from "next/link";
import type { Locale } from "@nosa/contracts";
import { MediaImage } from "@/shared/components/media-image";
import { getCategoryTree } from "../../api/catalog.queries";

/** The row of small round category photos under the header (the "stories" look in the design). */
export async function CategoryStrip({ locale, label }: { locale: Locale; label: string }) {
  const tree = await getCategoryTree();
  if (!tree.length) return null;

  return (
    <nav aria-label={label} className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
      <ul className="flex snap-x gap-4 overflow-x-auto pb-2 sm:justify-center sm:gap-8">
        {tree.map((category) => (
          <li key={category.id} className="snap-start">
            <Link href={`/${locale}/shop/${category.slug}`} className="group flex w-20 flex-col items-center gap-2 text-center sm:w-24">
              <span className="relative block size-16 overflow-hidden rounded-full border-2 border-primary-600 p-0.5 transition-transform duration-300 group-hover:scale-105 sm:size-20">
                <span className="relative block size-full overflow-hidden rounded-full bg-muted">
                  <MediaImage image={category.image} alt="" fill sizes="80px" />
                </span>
              </span>
              <span className="text-xs font-medium leading-tight group-hover:text-primary-700">{category.name[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
