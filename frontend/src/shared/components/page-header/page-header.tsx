import type { ReactNode } from "react";

type PageHeaderProps = {
  title: React.ReactNode;
  subtitle?: string;
  /** Main button of the screen ("Add product"), shown at the end. */
  action?: ReactNode;
};

/** Title block every dashboard screen starts with. */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-primary-800 sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
