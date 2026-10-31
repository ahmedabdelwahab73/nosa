import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import { Illustration, type IllustrationName } from "@/shared/components/illustration";
import { MediaImage } from "@/shared/components/media-image";
import { Reveal } from "@/shared/components/reveal";
import { SectionTitle } from "@/shared/components/section-title";
import { Button } from "@/shared/ui/button";
import type { RenderableContent } from "../../lib/home-sections";
import { localizedHref } from "../hero-section";

type RichTextContent = Extract<RenderableContent, { type: "richText" }>;

/** "Made by hand": centred text, or (with stats) a two-column panel with a picture and figures, as in the design. */
export function RichTextSection({ content, locale, illustration }: { content: RichTextContent; locale: Locale; illustration?: IllustrationName }) {
  const paragraphs = content.body[locale].split(/\n{2,}/).filter(Boolean);
  const title = content.title?.[locale] ?? "";

  if (!content.stats?.length) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        <Reveal className="flex flex-col items-center gap-5">
          {title && <SectionTitle title={title} />}
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <Reveal>
        <div className="stitch-soft grid items-center overflow-hidden rounded-3xl border bg-blush lg:grid-cols-[0.8fr_1.2fr]">
          <span className="relative flex min-h-56 items-center justify-center bg-primary-50 lg:h-full lg:min-h-72">
            {content.image ? (
              <MediaImage image={content.image} alt={content.image.alt?.[locale] || title} fill sizes="(min-width: 1024px) 40vw, 100vw" />
            ) : (
              illustration && <Illustration name={illustration} alt="" className="mx-auto max-h-72 w-auto object-contain p-6" />
            )}
          </span>
          <div className="grid items-center gap-6 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col items-start gap-3">
              {title && <h2 className="font-display text-3xl font-semibold text-primary-800 sm:text-4xl">{title}</h2>}
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {content.cta && (
                <Button asChild size="lg" className="mt-2 h-10 px-5">
                  <Link href={localizedHref(content.cta.href, locale)}>
                    {content.cta.label[locale]}
                    <ArrowRight className="rtl:rotate-180" />
                  </Link>
                </Button>
              )}
            </div>
            <dl className="flex gap-6 md:flex-col md:border-s md:border-dashed md:ps-6">
              {content.stats.map((stat) => (
                <div key={stat.label[locale]}>
                  <dd className="font-display text-2xl font-semibold text-primary-800">{stat.value}</dd>
                  <dt className="text-sm text-muted-foreground">{stat.label[locale]}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
