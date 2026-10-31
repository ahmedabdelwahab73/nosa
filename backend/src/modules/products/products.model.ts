import { Schema, model, Types, type InferSchemaType, type HydratedDocument } from "mongoose";
import { CUSTOMIZATION_FIELD_TYPES, PRODUCT_STATUSES } from "@nosa/contracts";
import { imageSchema, localizedTextSchema, requiredLocalizedTextSchema, seoSchema } from "@/shared/db/schemas";

const optionValueSchema = new Schema(
  { value: { type: String, required: true }, label: requiredLocalizedTextSchema, hex: String },
  { _id: false },
);

const optionSchema = new Schema(
  { key: { type: String, enum: ["size", "color"], required: true }, name: requiredLocalizedTextSchema, values: [optionValueSchema] },
  { _id: false },
);

const variantSchema = new Schema(
  {
    sku: { type: String, required: true },
    optionValues: { type: Map, of: String, default: {} },
    price: Number,
    stock: { type: Number, default: 0, min: 0 },
    isMadeToOrder: { type: Boolean, default: false },
  },
  { _id: false },
);

const customizationFieldSchema = new Schema(
  {
    key: { type: String, required: true },
    label: requiredLocalizedTextSchema,
    type: { type: String, enum: CUSTOMIZATION_FIELD_TYPES, required: true },
    required: { type: Boolean, default: false },
    maxLength: Number,
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: requiredLocalizedTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: requiredLocalizedTextSchema, required: true },
    careInstructions: localizedTextSchema,
    category: { type: Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: PRODUCT_STATUSES, default: "draft" },
    isFeatured: { type: Boolean, default: false },
    images: { type: [imageSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    options: { type: [optionSchema], default: [] },
    variants: { type: [variantSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    isMadeToOrder: { type: Boolean, default: false },
    productionDays: { type: Number, default: 0 },
    setItems: { type: [requiredLocalizedTextSchema], default: [] },
    customization: {
      enabled: { type: Boolean, default: false },
      fields: { type: [customizationFieldSchema], default: [] },
      extraPrice: { type: Number, default: 0 },
    },
    seo: seoSchema,
    rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    salesCount: { type: Number, default: 0 },

    // Denormalised on save so listing filters/sorts hit indexes instead of scanning variants.
    effectivePrice: { type: Number, required: true },
    inStock: { type: Boolean, default: false },
    filterSizes: { type: [String], default: [] },
    filterColors: { type: [String], default: [] },
  },
  { timestamps: true },
);

productSchema.pre("validate", function () {
  this.effectivePrice = this.salePrice ?? this.price;
  this.inStock = this.variants.length
    ? this.variants.some((v) => v.isMadeToOrder || v.stock > 0)
    : this.isMadeToOrder || this.stock > 0;
  this.filterSizes = this.options.find((o) => o.key === "size")?.values.map((v) => v.value) ?? [];
  this.filterColors = this.options.find((o) => o.key === "color")?.values.map((v) => v.value) ?? [];
});

productSchema.index({ status: 1, category: 1, effectivePrice: 1 });
productSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
productSchema.index({ status: 1, salesCount: -1 });
productSchema.index({ filterSizes: 1 });
productSchema.index({ filterColors: 1 });
productSchema.index({ "name.ar": "text", "name.en": "text", tags: "text" }, { weights: { "name.ar": 5, "name.en": 5, tags: 2 } });

export type Product = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<Product>;
export const ProductModel = model("Product", productSchema);
