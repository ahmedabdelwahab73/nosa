import Link from "next/link";
import { connection } from "next/server";
import { BarChart3, Boxes, CircleDollarSign, Gem, PieChart, ReceiptText, Scissors, ShoppingBag, UserPlus } from "lucide-react";
import { ORDER_STATUSES } from "@nosa/contracts";
import { Panel } from "@/shared/components/panel";
import { StatusBadge } from "@/shared/components/status-badge";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getSession } from "@/shared/lib/auth";
import { formatDate, formatNumber, formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { RevenueChart } from "../revenue-chart";
import { Sparkline } from "../sparkline";
import { StatCard } from "../stat-card";
import { StatusDonut } from "../status-donut";
import { OVERVIEW_RANGES, getDashboardOverview, parseRange } from "./dashboard-overview.data";

type DashboardOverviewProps = { searchParams: Promise<{ days?: string }> };

/** Hour of day in Cairo, so the greeting matches the shop's day. */
const cairoHour = () =>
  Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Cairo" }).format(new Date()));

const greetingKey = (hour: number) => (hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening");

export async function DashboardOverview({ searchParams }: DashboardOverviewProps) {
  await connection();
  const [locale, dict, { days: daysParam }, user] = await Promise.all([getLocale(), getDictionary(), searchParams, getSession()]);
  const days = parseRange(daysParam);
  const t = dict.dashboard.overview;
  const overview = await getDashboardOverview(days);
  const name = (text: { ar: string; en: string }) => text[locale];

  const statusRows = ORDER_STATUSES.flatMap((status) => {
    const count = overview.ordersByStatus[status] ?? 0;
    return count > 0 ? [{ status, count, label: dict.orderStatus[status] }] : [];
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-primary-800 sm:text-3xl">
            {t.greeting[greetingKey(cairoHour())].replace("{name}", user?.name.split(" ")[0] ?? "")}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <nav aria-label={t.revenueTitle} className="flex gap-1 rounded-full border bg-card p-1">
          {OVERVIEW_RANGES.map((range) => (
            <Link
              key={range}
              href={`?days=${range}`}
              aria-current={range === days ? "true" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                range === days ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t.ranges[String(range) as keyof typeof t.ranges]}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<CircleDollarSign />}
          label={t.kpi.revenue}
          value={formatPrice(overview.revenue, locale)}
          trend={<Sparkline values={overview.revenueByDay.map((day) => day.revenue)} />}
        />
        <StatCard
          icon={<ShoppingBag />}
          label={t.kpi.orders}
          value={formatNumber(overview.orders, locale)}
          trend={<Sparkline values={overview.revenueByDay.map((day) => day.orders)} />}
        />
        <StatCard icon={<Gem />} label={t.kpi.averageOrder} value={formatPrice(overview.averageOrderValue, locale)} />
        <StatCard icon={<UserPlus />} label={t.kpi.newCustomers} value={formatNumber(overview.newCustomers, locale)} />
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel title={t.revenueTitle} icon={<BarChart3 />} className="xl:col-span-3">
          <RevenueChart data={overview.revenueByDay} locale={locale} label={t.revenueTitle} />
        </Panel>
        <Panel title={t.statusTitle} icon={<PieChart />} className="xl:col-span-2">
          {statusRows.length ? (
            <StatusDonut data={statusRows} locale={locale} totalLabel={t.statusTotal} />
          ) : (
            <Empty>{t.emptyOrders}</Empty>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel title={t.recentOrdersTitle} icon={<ReceiptText />} className="xl:col-span-3">
          {overview.recentOrders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.table.order}</TableHead>
                  <TableHead>{t.table.customer}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.table.date}</TableHead>
                  <TableHead>{t.table.total}</TableHead>
                  <TableHead>{t.table.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell dir="ltr" className="text-start font-medium"><Link href={`/${locale}/dashboard/orders/${order.id}`} className="text-primary hover:underline">{order.number}</Link></TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(order.createdAt, locale)}</TableCell>
                    <TableCell className="tabular-nums">{formatPrice(order.total, locale)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} label={dict.orderStatus[order.status]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>{t.emptyOrders}</Empty>
          )}
        </Panel>

        <div className="flex flex-col gap-4 xl:col-span-2">
          <Panel title={t.kpi.newCustomOrders} icon={<Scissors />}>
            <p className="font-display text-4xl font-semibold text-primary-800 tabular-nums">{formatNumber(overview.newCustomOrders, locale)}</p>
          </Panel>

          <Panel title={t.topProductsTitle} icon={<Gem />}>
            {overview.topProducts.length ? (
              <ol className="flex flex-col divide-y">
                {overview.topProducts.map((product, index) => (
                  <li key={product.productId} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-5 text-muted-foreground tabular-nums">{formatNumber(index + 1, locale)}</span>
                    <span className="flex-1 font-medium">{name(product.name)}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatNumber(product.quantity, locale)} {t.table.sold}
                    </span>
                    <span className="w-24 text-end font-medium tabular-nums">{formatPrice(product.revenue, locale)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>{t.emptyTopProducts}</Empty>
            )}
          </Panel>

          <Panel title={t.lowStockTitle} icon={<Boxes />}>
            {overview.lowStock.length ? (
              <ul className="flex flex-col divide-y">
                {overview.lowStock.map((product) => (
                  <li key={product.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="flex-1 font-medium">{name(product.name)}</span>
                    <span className="rounded-full bg-yarn-50 px-2.5 py-0.5 text-xs text-yarn-600">
                      {t.stockLeft.replace("{count}", formatNumber(Math.min(...product.items.map((item) => item.stock)), locale))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{t.emptyLowStock}</Empty>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-muted/60 px-4 py-8 text-center text-sm text-muted-foreground">{children}</p>;
}
