"use client";

import { Area, AreaChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/shared/ui/chart";

const config = { value: { color: "var(--color-primary-500)" } } satisfies ChartConfig;

/** Tiny trend line inside a stat card; decorative, so the numbers beside it carry the meaning. */
export function Sparkline({ values }: { values: number[] }) {
  const rows = values.map((value, index) => ({ index, value }));

  return (
    <ChartContainer config={config} className="h-12 w-28" aria-hidden>
      <AreaChart data={rows} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} fill="url(#spark-fill)" isAnimationActive={false} />
      </AreaChart>
    </ChartContainer>
  );
}
