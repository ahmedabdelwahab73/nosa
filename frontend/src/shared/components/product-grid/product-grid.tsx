import type { Locale, ProductCardDto } from "@nosa/contracts";
import { ProductCard } from "@/shared/components/product-card";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/utils";

type ProductGridProps = {
  products: ProductCardDto[];
  locale: Locale;
  labels: Dictionary["store"]["product"];
  /** Columns on wide screens: shop pages with a filter column use 3, full-width rows use 4. */
  columns?: 3 | 4;
  /** The first row is above the fold, so its images load with priority. */
  priorityCount?: number;
  className?: string;
};

const columnClasses = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-3 xl:grid-cols-4" } as const;

export function ProductGrid({ products, locale, labels, columns = 4, priorityCount = 0, className }: ProductGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3", columnClasses[columns], className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} locale={locale} labels={labels} priority={index < priorityCount} />
      ))}
    </div>
  );
}
