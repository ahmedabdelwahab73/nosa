"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { Locale } from "@nosa/contracts";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/ui/chart";

type RevenueChartProps = {
  data: { date: string; revenue: number }[];
  locale: Locale;
  label: string;
};

export function RevenueChart({ data, locale, label }: RevenueChartProps) {
  const config = { revenue: { label, color: "var(--color-primary-600)" } } satisfies ChartConfig;
  const rows = data.map(({ date, revenue }) => ({ day: formatDate(date, locale, { day: "numeric", month: "short" }), revenue }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={rows} margin={{ left: 8, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" formatter={(value) => formatPrice(Number(value), locale)} />}
        />
        <Area dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} fill="url(#revenue-fill)" />
      </AreaChart>
    </ChartContainer>
  );
}
