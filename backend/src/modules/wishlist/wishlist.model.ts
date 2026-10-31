import { Schema, model, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    products: { type: [{ type: Types.ObjectId, ref: "Product" }], default: [] },
  },
  { timestamps: true },
);

export const MAX_WISHLIST_ITEMS = 200;
export const WishlistModel = model("Wishlist", wishlistSchema);
