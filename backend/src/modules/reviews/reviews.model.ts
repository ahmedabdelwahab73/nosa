import { Schema, model, Types } from "mongoose";
import { REVIEW_STATUSES } from "@nosa/contracts";
import { imageSchema } from "@/shared/db/schemas";

const reviewSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: "Product", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, required: true, maxlength: 1000 },
    images: { type: [imageSchema], default: [] },
    status: { type: String, enum: REVIEW_STATUSES, default: "pending", index: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// One review per customer per product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

export const ReviewModel = model("Review", reviewSchema);
