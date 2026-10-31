import { Types } from "mongoose";
import { ApiError } from "@/shared/http/api-error";
import { getPublishedProductRef, listProductCardsByIds } from "@/modules/products/products.service";
import { MAX_WISHLIST_ITEMS, WishlistModel } from "./wishlist.model";

export async function getWishlist(userId: string) {
  const doc = await WishlistModel.findOne({ user: userId });
  const ids = (doc?.products ?? []).map(String).reverse(); // newest first
  return { productIds: ids, items: await listProductCardsByIds(ids) };
}

/** Adds the product, or removes it when it's already saved. */
export async function toggleWishlist(userId: string, productId: string) {
  const product = await getPublishedProductRef({ id: productId });
  const doc = await WishlistModel.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true });

  const saved = doc.products.some((id) => String(id) === product.id);
  if (saved) doc.products.pull(product.id);
  else {
    if (doc.products.length >= MAX_WISHLIST_ITEMS) throw new ApiError("CONFLICT", "Wishlist is full");
    doc.products.push(new Types.ObjectId(product.id));
  }
  await doc.save();
  return { productId: product.id, saved: !saved };
}
