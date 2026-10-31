import type { Metadata } from "next";
import { LOCALES, LOCALE_DIR } from "@nosa/contracts";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { siteConfig } from "@/shared/config/site";
import { AppProviders } from "@/shared/components/app-providers";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { fontVariables } from "@/shared/styles/fonts";
import "@/shared/styles/globals.css";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.title, template: `%s | ${dict.meta.title}` },
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const errorLabels = { title: dict.errors.pageTitle, text: dict.errors.pageText, retry: dict.errors.retry, requestId: dict.errors.requestId };

  return (
    <html lang={locale} dir={LOCALE_DIR[locale]} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <AppProviders dir={LOCALE_DIR[locale]}>
          <ErrorBoundary labels={errorLabels}>{children}</ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  );
}
