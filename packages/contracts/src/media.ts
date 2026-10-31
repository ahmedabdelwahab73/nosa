import { z } from "zod";
import { localizedTextSchema } from "./i18n";

export const MEDIA_FOLDERS = ["products", "categories", "cms", "stories", "reviews", "custom-orders"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

/** Folders customers may upload into (smaller limits); the rest are staff only. */
export const CUSTOMER_MEDIA_FOLDERS = ["reviews", "custom-orders"] as const satisfies readonly MediaFolder[];

/** Image metadata stored in MongoDB — the bytes live on Cloudinary. */
export const imageSchema = z.object({
  publicId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.string().min(1),
  transparentPublicId: z.string().min(1).optional(),
  alt: localizedTextSchema.partial().optional(),
});

export type ImageAsset = z.infer<typeof imageSchema>;

export const mediaSignSchema = z.object({ folder: z.enum(MEDIA_FOLDERS) });

export type MediaSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  maxFileSize: number;
  uploadUrl: string;
};
