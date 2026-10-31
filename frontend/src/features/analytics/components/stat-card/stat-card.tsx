import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  /** Optional trend line (a Sparkline). */
  trend?: ReactNode;
};

export function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 [&_svg]:size-5" aria-hidden>
          {icon}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="font-display text-2xl font-semibold text-primary-800 tabular-nums">{value}</span>
        </div>
        {trend}
      </div>
      <span aria-hidden className="stitch-soft border-t-2" />
    </div>
  );
}
