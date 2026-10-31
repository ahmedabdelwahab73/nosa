import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type PagerProps = {
  page: number;
  pages: number;
  /** Builds the URL for a page, keeping the other filters (runs on the server). */
  hrefFor: (page: number) => string;
  labels: { previous: string; next: string };
  className?: string;
};

/** Page numbers with "…" gaps: always the first, last and the pages around the current one. */
function visiblePages(page: number, pages: number) {
  const wanted = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...wanted].sort((a, b) => a - b);
  return sorted.flatMap((n, index) => (index > 0 && n - sorted[index - 1]! > 1 ? ["gap" as const, n] : [n]));
}

/** URL-driven pagination: plain links, so pages stay server-rendered and shareable. */
export function Pager({ page, pages, hrefFor, labels, className }: PagerProps) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <Button asChild variant="ghost" size="icon" aria-disabled={page <= 1} className={cn(page <= 1 && "pointer-events-none opacity-40")}>
        <Link href={hrefFor(Math.max(1, page - 1))} aria-label={labels.previous} scroll={false}>
          <ChevronRight className="ltr:rotate-180" aria-hidden />
        </Link>
      </Button>
      {visiblePages(page, pages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button key={item} asChild variant={item === page ? "default" : "ghost"} size="icon">
            <Link href={hrefFor(item)} aria-current={item === page ? "page" : undefined} scroll={false}>
              {item}
            </Link>
          </Button>
        ),
      )}
      <Button asChild variant="ghost" size="icon" aria-disabled={page >= pages} className={cn(page >= pages && "pointer-events-none opacity-40")}>
        <Link href={hrefFor(Math.min(pages, page + 1))} aria-label={labels.next} scroll={false}>
          <ChevronLeft className="ltr:rotate-180" aria-hidden />
        </Link>
      </Button>
    </nav>
  );
}
