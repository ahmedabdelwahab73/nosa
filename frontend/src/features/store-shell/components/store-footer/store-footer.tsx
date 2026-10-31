import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Locale, LocalizedText, PublicSettingsDto } from "@nosa/contracts";
import { Illustration } from "@/shared/components/illustration";
import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import { Logo } from "@/shared/components/logo";
import { SocialIcon } from "@/shared/components/social-icon";
import type { Dictionary } from "@/shared/i18n/get-dictionary";

import { getCopyrightYear } from "./store-footer.data";

type StoreFooterProps = {
  locale: Locale;
  dict: Dictionary;
  settings: PublicSettingsDto;
  categories: { slug: string; label: string }[];
  /** Published info pages (about, shipping, faq...). */
  pages: { slug: string; title: LocalizedText }[];
};

const SOCIALS = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
} as const;

const digits = (phone: string) => phone.replace(/\D/g, "");

const linkClass = "text-sm text-canvas/80 transition-colors hover:text-white";
const headingClass = "mb-1 font-display text-lg text-primary-200";
/** Columns after the first are separated by the stitched vertical line from the design. */
const columnClass = "flex flex-col gap-2 md:border-s md:border-dashed md:border-canvas/20 md:ps-8";

export async function StoreFooter({ locale, dict, settings, categories, pages }: StoreFooterProps) {
  const t = dict.store.footer;
  const { contact, socials } = settings;
  const socialLinks = (Object.keys(SOCIALS) as (keyof typeof SOCIALS)[]).filter((key) => socials[key]);
  const hasContact = Boolean(contact.whatsapp || contact.phone || contact.email);
  const year = await getCopyrightYear();

  return (
    <footer className="mt-16 bg-ink text-canvas">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.1fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo href={`/${locale}`} tone="light" className="h-24" />
        </div>

        <nav aria-label={t.shop} className={columnClass}>
          <h2 className={headingClass}>{t.shop}</h2>
          {categories.map((category) => (
            <Link key={category.slug} href={`/${locale}/shop/${category.slug}`} className={linkClass}>
              {category.label}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.about} className={columnClass}>
          <h2 className={headingClass}>{t.about}</h2>
          {pages.map((page) => (
            <Link key={page.slug} href={`/${locale}/pages/${page.slug}`} className={linkClass}>
              {page.title[locale]}
            </Link>
          ))}
          <Link href={`/${locale}/custom-order`} className={linkClass}>
            {dict.common.customOrder}
          </Link>
          {hasContact && (
            <div className="mt-2 flex flex-col gap-2">
              {contact.whatsapp && (
                <a href={`https://wa.me/${digits(contact.whatsapp)}`} className={`${linkClass} inline-flex items-center gap-2`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden />
                  {t.whatsapp}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} dir="ltr" className={`${linkClass} inline-flex items-center gap-2`}>
                  <Phone className="size-4" aria-hidden />
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <Mail className="size-4" aria-hidden />
                  {contact.email}
                </a>
              )}
            </div>
          )}
        </nav>

        {socialLinks.length > 0 && (
          <div className={columnClass}>
            <h2 className={headingClass}>{t.follow}</h2>
            <div className="flex gap-3">
              {socialLinks.map((key) => {
                const label = SOCIALS[key];
                return (
                  <a
                    key={key}
                    href={socials[key]}
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-canvas/30 text-canvas/80 transition-colors hover:border-white hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon network={key} />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className={`${columnClass} items-center justify-center`}>
          <Illustration name="handmade-with-love" alt={t.tagline} className="w-44 opacity-90" />
        </div>
      </div>

      <div className="border-t border-dashed border-canvas/20">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-canvas/70 sm:px-6">
          <p>
            © {year} {settings.storeName[locale]}. {t.rights}
          </p>
          <LocaleSwitcher label={dict.common.switchLocale} className="border-canvas/30 text-canvas hover:text-white" />
        </div>
      </div>
    </footer>
  );
}
