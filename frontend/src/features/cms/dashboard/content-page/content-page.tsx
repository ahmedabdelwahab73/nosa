import { connection } from "next/server";
import { PageHeader } from "@/shared/components/page-header";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { ContentTabs } from "../content-tabs";
import { HomeManager } from "../home-manager";
import { getHomeEditorData } from "./content-page.data";

/** "Site content" → the home page tab: the owner arranges, edits, hides and orders the sections. */
export async function ContentPage() {
  await connection();
  const [locale, dict, messages, { sections, categories }] = await Promise.all([getLocale(), getDictionary(), getFeedbackMessages(), getHomeEditorData()]);
  const t = dict.dashboard.content;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <ContentTabs locale={locale} active="home" labels={t.tabs} />
      <HomeManager
        sections={sections}
        locale={locale}
        labels={t}
        languages={dict.dashboard.productForm.languages}
        categories={categories}
        uploaderLabels={dict.dashboard.imageUploader}
        invalidMessage={dict.dashboard.productForm.invalid}
        messages={messages}
      />
    </div>
  );
}
