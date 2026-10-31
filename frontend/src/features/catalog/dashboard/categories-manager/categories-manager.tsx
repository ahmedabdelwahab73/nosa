import { connection } from "next/server";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { CategoriesTable } from "../categories-table";
import { listDashboardCategories } from "./categories-manager.data";

export async function CategoriesManager() {
  await connection();
  const [locale, dict, messages, categories] = await Promise.all([
    getLocale(),
    getDictionary(),
    getFeedbackMessages(),
    listDashboardCategories(),
  ]);

  return (
    <CategoriesTable
      categories={categories}
      locale={locale}
      labels={dict.dashboard.categories}
      languages={dict.dashboard.productForm.languages}
      // Same field-error wording as the product form: required, invalid slug...
      errorLabels={dict.dashboard.productForm.errors}
      invalidMessage={dict.dashboard.productForm.invalid}
      uploaderLabels={dict.dashboard.imageUploader}
      messages={messages}
    />
  );
}
