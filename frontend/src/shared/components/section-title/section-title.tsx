import { ThreadLine } from "@/shared/components/thread-line";
import { YarnBall } from "@/shared/components/yarn-ball";
import { cn } from "@/shared/lib/utils";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  /**
   * "stacked": centered title with the heart thread under it (hero-like sections).
   * "inline": title at the start, a stitched line running to a yarn ball (shop rows, as in the designs).
   */
  variant?: "stacked" | "inline";
  /** Optional link or button at the end of an inline title ("View all"). */
  action?: React.ReactNode;
  className?: string;
};

export function SectionTitle({ title, subtitle, variant = "stacked", action, className }: SectionTitleProps) {
  if (variant === "inline") {
    return (
      <header className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-semibold text-primary-800 sm:text-3xl">{title}</h2>
          <span aria-hidden className="stitch h-0 flex-1 border-t-2" />
          <YarnBall className="size-5 shrink-0" />
          {action}
        </div>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </header>
    );
  }

  return (
    <header className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <h2 className="font-display text-3xl font-semibold text-primary-800 sm:text-4xl">{title}</h2>
      <ThreadLine variant="heart" className="w-44" />
      {subtitle && <p className="max-w-2xl text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
