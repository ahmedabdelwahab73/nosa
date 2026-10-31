import { Schema, model, Types } from "mongoose";

const cartItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: "Product", required: true },
  sku: String,
  quantity: { type: Number, required: true, min: 1 },
  customization: { type: Map, of: String, default: {} },
});

/** One cart per signed-in user or per guest id (cookie). Abandoned carts expire after 30 days. */
const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", unique: true, sparse: true },
    guestId: { type: String, unique: true, sparse: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: { type: String, default: null },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export const CART_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const CartModel = model("Cart", cartSchema);
export type CartDocument = InstanceType<typeof CartModel>;
