import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import { Illustration, type IllustrationName } from "@/shared/components/illustration";
import { MediaImage } from "@/shared/components/media-image";
import { Button } from "@/shared/ui/button";
import type { RenderableContent } from "../../lib/home-sections";
import { localizedHref } from "../hero-section";

type BannerContent = Extract<RenderableContent, { type: "banner" }>;

/**
 * A wide promo band (custom embroidery, custom orders...). With `steps` it also lists the numbered
 * steps beside the text. The picture is the owner image, or shipped artwork until one is added.
 */
export function BannerSection({ content, locale, illustration }: { content: BannerContent; locale: Locale; illustration?: IllustrationName }) {
  const title = content.title[locale];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="stitch-soft grid items-center overflow-hidden rounded-3xl border bg-blush md:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col items-start gap-3 p-6 sm:p-10">
          <h2 className="font-display text-3xl font-semibold text-primary-800 sm:text-4xl">{title}</h2>
          {content.text && <p className="max-w-md text-muted-foreground">{content.text[locale]}</p>}
          {content.cta && (
            <Button asChild size="lg" className="mt-2 h-10 px-5">
              <Link href={localizedHref(content.cta.href, locale)}>
                {content.cta.label[locale]}
                <ArrowRight className="rtl:rotate-180" />
              </Link>
            </Button>
          )}
        </div>

        {content.steps?.length ? (
          <ol className="flex items-start justify-center gap-4 px-6 pb-6 md:border-s md:border-dashed md:p-8">
            {content.steps.map((step, index) => (
              <li key={index} className="flex w-24 flex-col items-center gap-2 text-center text-sm">
                <span className="grid size-8 place-items-center rounded-full bg-primary-700 font-semibold text-primary-foreground">{index + 1}</span>
                {step[locale]}
              </li>
            ))}
          </ol>
        ) : (
          <span className="hidden md:block" />
        )}

        <span className="relative flex items-center justify-center md:min-h-56">
          {content.image ? (
            <MediaImage image={content.image} alt={content.image.alt?.[locale] || title} fill sizes="(min-width: 768px) 33vw, 100vw" />
          ) : (
            illustration && <Illustration name={illustration} alt="" className="mx-auto max-h-56 w-auto object-contain p-4" />
          )}
        </span>
      </div>
    </section>
  );
}
