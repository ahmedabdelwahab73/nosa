"use client";

import { Cell, Pie, PieChart } from "recharts";
import type { Locale, OrderStatus } from "@nosa/contracts";
import { formatNumber } from "@/shared/lib/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/ui/chart";
import { cn } from "@/shared/lib/utils";
import { STATUS_COLORS, STATUS_DOT_CLASSES } from "../../lib/status-colors";

type StatusDonutProps = {
  /** Only statuses that have orders. */
  data: { status: OrderStatus; count: number; label: string }[];
  locale: Locale;
  totalLabel: string;
};

export function StatusDonut({ data, locale, totalLabel }: StatusDonutProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const config = Object.fromEntries(data.map(({ status, label }) => [status, { label, color: STATUS_COLORS[status] }])) satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-48 shrink-0">
        <ChartContainer config={config} className="size-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={58} outerRadius={88} paddingAngle={2} strokeWidth={0}>
              {data.map(({ status }) => (
                <Cell key={status} fill={STATUS_COLORS[status]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-primary-800">{formatNumber(total, locale)}</span>
          <span className="text-xs text-muted-foreground">{totalLabel}</span>
        </div>
      </div>
      <ul className="grid w-full gap-2 text-sm">
        {data.map(({ status, label, count }) => (
          <li key={status} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", STATUS_DOT_CLASSES[status])} aria-hidden />
            <span className="flex-1">{label}</span>
            <span className="font-medium tabular-nums">{formatNumber(count, locale)}</span>
            <span className="w-12 text-end text-muted-foreground tabular-nums">{Math.round((count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
