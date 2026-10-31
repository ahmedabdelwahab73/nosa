import Image from "next/image";
import { cn } from "@/shared/lib/utils";

/**
 * Fixed brand artwork shipped in /public/illustrations (pre-sized WebP, transparent).
 * Content images (hero, banners, products) come from Cloudinary instead.
 */
const ILLUSTRATIONS = {
  "yarn-ball": { width: 400, height: 473 },
  "handmade-with-love": { width: 800, height: 116 },
  "yarn-happy": { width: 800, height: 533 },
  "yarn-basket": { width: 900, height: 570 },
  "sidebar-flowers": { width: 260, height: 928 },
  "empty-cart": { width: 700, height: 547 },
  "empty-search": { width: 700, height: 635 },
  /** Default hero until the owner uploads one from the dashboard. */
  "hero-baby-set": { width: 1672, height: 941 },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

type IllustrationProps = {
  name: IllustrationName;
  /** Empty string for purely decorative artwork. */
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Illustration({ name, alt, className, priority }: IllustrationProps) {
  const { width, height } = ILLUSTRATIONS[name];
  return (
    <Image
      src={`/illustrations/${name}.webp`}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      // Already sized and compressed; skipping the optimizer saves the Vercel image quota.
      unoptimized
      className={cn("h-auto select-none", className)}
    />
  );
}
