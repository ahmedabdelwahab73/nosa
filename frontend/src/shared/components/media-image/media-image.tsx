"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { ImageAsset } from "@nosa/contracts";
import { cloudinaryLoader } from "@/shared/lib/media/cloudinary-loader";
import { cn } from "@/shared/lib/utils";

type MediaImageProps = {
  image?: Pick<ImageAsset, "publicId" | "width" | "height">;
  alt: string;
  /** Fill the parent (which must be `relative` with a fixed size or aspect ratio). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const cloudinaryReady = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

/**
 * The only way to show a stored image: next/image through the Cloudinary loader.
 * Without an image (or before the Cloudinary account is connected) it shows a quiet placeholder.
 */
export function MediaImage({ image, alt, fill, sizes, priority, className }: MediaImageProps) {
  if (!image || !cloudinaryReady) {
    return (
      <span className={cn("flex size-full items-center justify-center bg-muted text-muted-foreground", className)} role="img" aria-label={alt}>
        <ImageIcon className="size-1/3" aria-hidden />
      </span>
    );
  }

  return (
    <Image
      loader={cloudinaryLoader}
      src={image.publicId}
      alt={alt}
      {...(fill ? { fill: true } : { width: image.width, height: image.height })}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
