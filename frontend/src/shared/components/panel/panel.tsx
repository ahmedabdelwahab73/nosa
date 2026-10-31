import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type PanelProps = {
  title: string;
  /** Small icon shown in a blush circle before the title. */
  icon?: ReactNode;
  /** Link or button at the end of the header ("View all"). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** White dashboard card with a titled header, as used across every dashboard screen. */
export function Panel({ title, icon, action, className, children }: PanelProps) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card", className)}>
      <header className="flex items-center gap-3">
        {icon && (
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 [&_svg]:size-4" aria-hidden>
            {icon}
          </span>
        )}
        <h2 className="flex-1 font-display text-lg font-semibold text-primary-800">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
