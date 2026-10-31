import { Schema, model, Types, type InferSchemaType } from "mongoose";
import { imageSchema, localizedTextSchema, requiredLocalizedTextSchema, seoSchema } from "@/shared/db/schemas";

const categorySchema = new Schema(
  {
    name: { type: requiredLocalizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    description: localizedTextSchema,
    image: imageSchema,
    parent: { type: Types.ObjectId, ref: "Category", default: null, index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    seo: seoSchema,
  },
  { timestamps: true },
);

export type Category = InferSchemaType<typeof categorySchema>;
export const CategoryModel = model("Category", categorySchema);
