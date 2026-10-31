import type { ImageLoaderProps } from "next/image";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Fixed width steps so Cloudinary (free plan) doesn't create a transformation per pixel width. */
const WIDTHS = [96, 256, 480, 768, 1080, 1440, 1920];

const snapWidth = (width: number) => WIDTHS.find((step) => step >= width) ?? WIDTHS[WIDTHS.length - 1];

/** Builds a delivery URL for a stored Cloudinary public id. The only place URLs are built. */
export function cloudinaryUrl(publicId: string, { width, quality }: { width?: number; quality?: number } = {}) {
  if (!CLOUD_NAME) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  const transforms = ["f_auto", `q_${quality ?? "auto"}`, width ? `w_${snapWidth(width)}` : null, "c_limit"]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/** Tiny blurred version for next/image `blurDataURL`. */
export const cloudinaryBlurUrl = (publicId: string) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_24,e_blur:400,q_30,f_auto/${publicId}`;

/** Pass to next/image as `loader` with `src={publicId}`. */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  return cloudinaryUrl(src, { width, quality });
}
