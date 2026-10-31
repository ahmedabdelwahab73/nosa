"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageAsset, Locale } from "@nosa/contracts";
import { MediaImage } from "@/shared/components/media-image";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useProductGallery } from "./product-gallery.ux";

type ProductGalleryProps = {
  images: ImageAsset[];
  name: string;
  locale: Locale;
  labels: { gallery: string; previous: string; next: string; image: string };
};

/** Big picture with thumbnails beside it (below on phones) and arrows to flip through. */
export function ProductGallery({ images, name, locale, labels }: ProductGalleryProps) {
  const gallery = useProductGallery(images.length);
  const current = images[gallery.index];
  const many = images.length > 1;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row" role="group" aria-label={labels.gallery}>
      {many && (
        <ul className="flex gap-2 overflow-x-auto sm:max-h-[34rem] sm:flex-col sm:overflow-y-auto sm:overflow-x-visible">
          {images.map((image, index) => (
            <li key={image.publicId} className="shrink-0">
              <button
                type="button"
                onClick={() => gallery.select(index)}
                aria-label={labels.image.replace("{n}", String(index + 1))}
                aria-current={index === gallery.index}
                className={cn("relative block size-16 overflow-hidden rounded-xl border-2 transition-colors sm:size-20", index === gallery.index ? "border-primary-600" : "border-transparent hover:border-primary-300")}
              >
                <MediaImage image={image} alt="" fill sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-3xl bg-muted shadow-card">
        <MediaImage image={current} alt={current?.alt?.[locale] || name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" />
        {many && (
          <>
            <Button type="button" variant="secondary" size="icon" className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full shadow-soft" onClick={gallery.previous} aria-label={labels.previous}>
              <ChevronRight className="ltr:rotate-180" />
            </Button>
            <Button type="button" variant="secondary" size="icon" className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full shadow-soft" onClick={gallery.next} aria-label={labels.next}>
              <ChevronLeft className="ltr:rotate-180" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
