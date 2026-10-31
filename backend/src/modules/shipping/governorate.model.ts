import { Schema, model } from "mongoose";
import { requiredLocalizedTextSchema } from "@/shared/db/schemas";

const governorateSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: requiredLocalizedTextSchema, required: true },
    fee: { type: Number, required: true, min: 0 },
    estimatedDays: { min: { type: Number, default: 2 }, max: { type: Number, default: 4 } },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const GovernorateModel = model("Governorate", governorateSchema);
