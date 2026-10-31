import { Schema } from "mongoose";

/** Reusable sub-schemas; never redefine these shapes inside a module. */

export const localizedTextSchema = new Schema(
  { ar: { type: String, trim: true }, en: { type: String, trim: true } },
  { _id: false },
);

export const requiredLocalizedTextSchema = new Schema(
  { ar: { type: String, trim: true, required: true }, en: { type: String, trim: true, required: true } },
  { _id: false },
);

/** Cloudinary metadata only — the image bytes never touch our servers. */
export const imageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    transparentPublicId: String,
    alt: localizedTextSchema,
  },
  { _id: false },
);

export const seoSchema = new Schema(
  { title: localizedTextSchema, description: localizedTextSchema },
  { _id: false },
);
