import { StatusPage } from "@/shared/components/status-page";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export default async function NotFound() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <StatusPage
      illustration="empty-search"
      title={dict.errors.notFoundTitle}
      text={dict.errors.notFoundText}
      action={{ href: `/${locale}`, label: dict.errors.backHome }}
    />
  );
}
