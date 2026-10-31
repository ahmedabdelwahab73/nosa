import { StatusPage } from "@/shared/components/status-page";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export default async function Forbidden() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <StatusPage
      illustration="empty-cart"
      title={dict.errors.forbiddenTitle}
      text={dict.errors.forbiddenText}
      action={{ href: `/${locale}/dashboard`, label: dict.errors.backDashboard }}
    />
  );
}
