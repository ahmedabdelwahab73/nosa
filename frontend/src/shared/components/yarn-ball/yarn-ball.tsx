import { cn } from "@/shared/lib/utils";

type YarnBallProps = {
  className?: string;
  /** Spins slowly, e.g. as a loading indicator. Respects reduced motion. */
  spinning?: boolean;
};

/** Line-drawn yarn ball accent (section titles, sidebar, loaders). Colored with `text-*`. */
export function YarnBall({ className, spinning }: YarnBallProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
      className={cn("size-6 text-primary-400", spinning && "motion-safe:animate-spin", className)}
    >
      <circle cx="16" cy="16" r="12" />
      <path d="M6.5 9.5c5 1.5 11 6.5 13 17" />
      <path d="M9 6.5c5 2.5 10.5 8.5 12.5 18.5" />
      <path d="M13 4.5c4.5 3 8.5 9 10 17" />
      <path d="M4.5 15c6-1 13 1 19 7.5" />
      <path d="M5.5 20.5c5-2 11-1.5 15.5 3.5" />
      <path d="M28 16c-2 4-4.5 6.5-8.5 8.5" />
    </svg>
  );
}
