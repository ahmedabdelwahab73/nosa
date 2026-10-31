import { connection } from "next/server";
import { PageHeader } from "@/shared/components/page-header";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { ShippingTable } from "../shipping-table";
import { listShippingRates } from "./shipping-page.data";

export async function ShippingPage() {
  await connection();
  const [locale, dict, messages, rates] = await Promise.all([getLocale(), getDictionary(), getFeedbackMessages(), listShippingRates()]);
  const t = dict.dashboard.shipping;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <ShippingTable rates={rates} locale={locale} labels={t} messages={messages} />
      </div>
    </div>
  );
}
