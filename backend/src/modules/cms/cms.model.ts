import { Schema, model, Types } from "mongoose";
import { localizedTextSchema, requiredLocalizedTextSchema, seoSchema } from "@/shared/db/schemas";

/** `content` shape depends on its `type`; it's validated by the zod union in contracts. */
const homeSectionSchema = new Schema(
  {
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const HomeSectionModel = model("HomeSection", homeSectionSchema);

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: requiredLocalizedTextSchema, required: true },
    body: { type: localizedTextSchema, required: true },
    isPublished: { type: Boolean, default: true },
    seo: seoSchema,
  },
  { timestamps: true },
);

export const PageModel = model("Page", pageSchema);
