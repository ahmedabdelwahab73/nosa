import { StarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type RatingStarsProps = {
  /** 0–5, halves are rounded. */
  value: number;
  count?: number;
  /** Already translated, e.g. "4.5 من 5". */
  label: string;
  className?: string;
};

export function RatingStars({ value, count, label, className }: RatingStarsProps) {
  const filled = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={label} role="img">
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon
            key={index}
            className={cn("size-4", index < filled ? "fill-primary-400 text-primary-400" : "text-line")}
          />
        ))}
      </span>
      {count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </span>
  );
}
