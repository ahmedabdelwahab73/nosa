import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import { Illustration } from "@/shared/components/illustration";
import { MediaImage } from "@/shared/components/media-image";
import { ThreadLine } from "@/shared/components/thread-line";
import { YarnBall } from "@/shared/components/yarn-ball";
import { Button } from "@/shared/ui/button";
import type { RenderableContent } from "../../lib/home-sections";

type HeroContent = Extract<RenderableContent, { type: "hero" }>;

type HeroSectionProps = {
  content: HeroContent;
  locale: Locale;
  eyebrow: string;
};

/** Internal links get the locale in front; full https links are left alone. */
export const localizedHref = (href: string, locale: Locale) => (href.startsWith("/") ? `/${locale}${href}` : href);

/** The big blush panel at the top of the home page. Title, text, image and buttons all come from the dashboard. */
export function HeroSection({ content, locale, eyebrow }: HeroSectionProps) {
  const title = content.title[locale];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="stitch-soft relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blush to-canvas">
        <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:p-14">
          <div className="relative z-10 flex flex-col items-start gap-5">
            <span className="font-script text-2xl text-primary-600">{eyebrow}</span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-primary-900 sm:text-5xl lg:text-6xl">{title}</h1>
            {content.subtitle && <p className="max-w-md text-lg text-muted-foreground">{content.subtitle[locale]}</p>}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link href={localizedHref(content.primaryCta.href, locale)}>
                  {content.primaryCta.label[locale]}
                  <ArrowRight className="rtl:rotate-180" />
                </Link>
              </Button>
              {content.secondaryCta && (
                <Button asChild size="xl" variant="outline">
                  <Link href={localizedHref(content.secondaryCta.href, locale)}>{content.secondaryCta.label[locale]}</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            {content.image ? (
              <span className="relative block aspect-[16/10] overflow-hidden rounded-2xl">
                <MediaImage image={content.image} alt={content.image.alt?.[locale] || title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" />
              </span>
            ) : (
              <Illustration name="hero-baby-set" alt={title} priority className="w-full rounded-2xl" />
            )}
          </div>
        </div>
        <ThreadLine className="pointer-events-none absolute inset-x-0 bottom-2 hidden h-10 w-full text-primary-400 sm:block" animated={false} />
        <YarnBall className="absolute bottom-4 end-6 hidden size-12 text-yarn-500 lg:block" />
      </div>
    </section>
  );
}
