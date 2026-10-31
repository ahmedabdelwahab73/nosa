import { connection } from "next/server";
import { PageHeader } from "@/shared/components/page-header";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { ContentTabs } from "../content-tabs";
import { PagesManager } from "../pages-manager";
import { listEditablePages } from "./content-page.data";

/** "Site content" → the info pages tab (about, shipping and returns, FAQ...). */
export async function PagesPage() {
  await connection();
  const [locale, dict, messages, pages] = await Promise.all([getLocale(), getDictionary(), getFeedbackMessages(), listEditablePages()]);
  const t = dict.dashboard.content;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <ContentTabs locale={locale} active="pages" labels={t.tabs} />
      <PagesManager pages={pages} locale={locale} labels={t} languages={dict.dashboard.productForm.languages} invalidMessage={dict.dashboard.productForm.invalid} messages={messages} />
    </div>
  );
}
