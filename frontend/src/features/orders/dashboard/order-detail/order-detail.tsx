import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { connection } from "next/server";
import { MediaImage } from "@/shared/components/media-image";
import { PageHeader } from "@/shared/components/page-header";
import { StatusBadge } from "@/shared/components/status-badge";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { formatDate, formatNumber, formatPrice } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { OrderNotes } from "../order-notes";
import { OrderStatusPanel } from "../order-status-panel";
import { getDashboardOrder } from "./order-detail.data";

const digits = (phone: string) => phone.replace(/\D/g, "");

const cardClass = "flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card sm:p-5";

export async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const [{ id }, locale, dict, messages] = await Promise.all([params, getLocale(), getDictionary(), getFeedbackMessages()]);
  const order = await getDashboardOrder(id);
  const t = dict.dashboard.orders;
  const d = t.detail;

  return (
    <div className="flex flex-col gap-5">
      <Link href={`/${locale}/dashboard/orders`} className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowRight className="size-4 ltr:rotate-180" aria-hidden />
        {d.back}
      </Link>

      <PageHeader
        title={<span dir="ltr">{order.number}</span>}
        subtitle={formatDate(order.createdAt, locale)}
        action={<StatusBadge status={order.status} label={dict.orderStatus[order.status]} className="px-3 py-1 text-sm" />}
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">
          <section className={cardClass}>
            <h2 className="font-display text-xl text-primary-800">{d.items}</h2>
            <ul className="flex flex-col divide-y">
              {order.items.map((item, index) => (
                <li key={`${item.sku ?? item.slug}-${index}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl border bg-muted">
                    <MediaImage image={item.image} alt="" fill sizes="64px" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                    <span className="font-medium">{item.name[locale]}</span>
                    {item.optionLabels.length > 0 && <span className="text-muted-foreground">{item.optionLabels.map((label) => label[locale]).join(" · ")}</span>}
                    {Object.keys(item.customization).length > 0 && (
                      <dl className="rounded-lg bg-blush px-2 py-1">
                        <dt className="text-xs font-medium text-primary-700">{d.customization}</dt>
                        {Object.entries(item.customization).map(([key, value]) => (
                          <dd key={key}>{value}</dd>
                        ))}
                      </dl>
                    )}
                    {item.isMadeToOrder && <Badge variant="secondary" className="w-fit">{d.madeToOrder}</Badge>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end text-sm">
                    <span className="font-medium tabular-nums">{formatPrice(item.lineTotal, locale)}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(item.quantity, locale)} × {formatPrice(item.unitPrice, locale)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="flex flex-col gap-1 border-t border-dashed pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{d.totals.subtotal}</dt>
                <dd>{formatPrice(order.subtotal, locale)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>
                    {d.totals.discount}
                    {order.couponCode && <span dir="ltr"> ({order.couponCode})</span>}
                  </dt>
                  <dd>−{formatPrice(order.discount, locale)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{d.totals.shipping}</dt>
                <dd>{order.shippingFee === 0 ? d.totals.free : formatPrice(order.shippingFee, locale)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>{d.totals.total}</dt>
                <dd>{formatPrice(order.total, locale)}</dd>
              </div>
            </dl>
          </section>

          <section className={cardClass}>
            <h2 className="font-display text-xl text-primary-800">{d.history}</h2>
            <ol className="flex flex-col gap-3">
              {[...order.statusHistory].reverse().map((entry, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{dict.orderStatus[entry.status]}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.at, locale)}</p>
                    {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className={cardClass}>
            <h2 className="font-display text-xl text-primary-800">{d.status.title}</h2>
            <OrderStatusPanel orderId={order.id} allowed={order.allowedNextStatuses} labels={d.status} orderStatus={dict.orderStatus} messages={messages} />
          </section>

          <section className={cardClass}>
            <h2 className="font-display text-xl text-primary-800">{d.customer}</h2>
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">{order.contact.name}</span>
              <span dir="ltr" className="text-start text-muted-foreground">
                {order.contact.phone}
              </span>
              {order.contact.email && <span className="text-muted-foreground">{order.contact.email}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${order.contact.phone}`}>
                  <Phone />
                  {d.call}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`https://wa.me/${digits(order.contact.phone)}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  {d.whatsapp}
                </a>
              </Button>
            </div>
            <div className="flex flex-col gap-1 border-t border-dashed pt-4 text-sm">
              <h3 className="font-medium">{d.address}</h3>
              <p className="text-muted-foreground">
                {order.address.governorateName[locale]}، {order.address.city}، {order.address.street}
              </p>
              <p className="text-muted-foreground">
                {t.paymentMethod[order.paymentMethod]} · {t.paymentStatus[order.paymentStatus]}
              </p>
              <p className="text-muted-foreground">{d.deliveryEstimate.replace("{min}", formatNumber(order.estimatedDays.min, locale)).replace("{max}", formatNumber(order.estimatedDays.max, locale))}</p>
              {order.notes && (
                <p className="mt-2 rounded-lg bg-muted px-3 py-2">
                  <span className="block text-xs font-medium">{d.customerNote}</span>
                  {order.notes}
                </p>
              )}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="font-display text-xl text-primary-800">{d.notes.title}</h2>
            <OrderNotes orderId={order.id} notes={order.internalNotes} locale={locale} labels={d.notes} messages={messages} />
          </section>
        </div>
      </div>
    </div>
  );
}
