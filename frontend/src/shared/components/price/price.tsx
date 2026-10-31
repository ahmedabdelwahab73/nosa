import type { Locale } from "@nosa/contracts";
import { formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type PriceProps = {
  amount: number;
  /** Original price; shown struck through when higher than `amount`. */
  compareAt?: number;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" } as const;

export function Price({ amount, compareAt, locale, size = "md", className }: PriceProps) {
  const onSale = compareAt !== undefined && compareAt > amount;

  return (
    <span className={cn("inline-flex items-baseline gap-2", sizes[size], className)}>
      <span className={cn("font-semibold", onSale ? "text-yarn-500" : "text-foreground")}>
        {formatPrice(amount, locale)}
      </span>
      {onSale && (
        <s className="text-[0.85em] text-muted-foreground">{formatPrice(compareAt, locale)}</s>
      )}
    </span>
  );
}
