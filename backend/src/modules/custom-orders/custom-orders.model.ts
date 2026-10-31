import { Schema, model, Types } from "mongoose";
import { CUSTOM_ORDER_STATUSES, CUSTOM_ORDER_TYPES } from "@nosa/contracts";
import { imageSchema } from "@/shared/db/schemas";

const customOrderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    user: { type: Types.ObjectId, ref: "User", index: true },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
    },
    type: { type: String, enum: CUSTOM_ORDER_TYPES, required: true },
    description: { type: String, required: true },
    sizes: String,
    colors: String,
    budget: Number,
    neededBy: Date,
    referenceImages: { type: [imageSchema], default: [] },
    status: { type: String, enum: CUSTOM_ORDER_STATUSES, default: "new", index: true },
    quote: { price: Number, productionDays: Number, message: String, at: Date },
    history: {
      type: [{ status: { type: String, enum: CUSTOM_ORDER_STATUSES }, at: { type: Date, default: Date.now }, note: String, _id: false }],
      default: [],
    },
  },
  { timestamps: true },
);

customOrderSchema.index({ status: 1, createdAt: -1 });

export const CustomOrderModel = model("CustomOrder", customOrderSchema);
