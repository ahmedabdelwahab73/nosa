import { Types } from "mongoose";
import { waitUntil } from "@vercel/functions";
import { CACHE_TAGS, type ImageAsset, type ReviewDto, type ReviewStatus } from "@nosa/contracts";
import { z } from "zod";
import { ApiError } from "@/shared/http/api-error";
import { buildMeta, toSkip, type PaginationQuery } from "@/shared/http/pagination";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { hasDeliveredProduct } from "@/modules/orders/orders.service";
import { getPublishedProductRef, setProductRating } from "@/modules/products/products.service";
import { getUserOrThrow } from "@/modules/users/users.service";
import type { reviewInputSchema } from "@nosa/contracts";
import { ReviewModel } from "./reviews.model";

type ReviewDoc = InstanceType<typeof ReviewModel>;

const toDto = (doc: ReviewDoc): ReviewDto => ({
  id: doc.id,
  rating: doc.rating,
  body: doc.body,
  images: doc.images.map((image) => image.toObject() as ImageAsset),
  author: doc.authorName,
  isVerifiedPurchase: doc.isVerifiedPurchase,
  createdAt: (doc as unknown as { createdAt: Date }).createdAt.toISOString(),
});

/** Recomputes the product's average from approved reviews only. */
async function refreshRating(productId: string) {
  const [stats] = await ReviewModel.aggregate<{ average: number; count: number }>([
    { $match: { product: new Types.ObjectId(productId), status: "approved" } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await setProductRating(productId, { average: Math.round((stats?.average ?? 0) * 10) / 10, count: stats?.count ?? 0 });
}

export async function listApprovedReviews(slug: string, page: PaginationQuery) {
  const product = await getPublishedProductRef({ slug });
  const filter = { product: product.id, status: "approved" };
  const [docs, total] = await Promise.all([
    ReviewModel.find(filter).sort({ createdAt: -1 }).skip(toSkip(page)).limit(page.limit),
    ReviewModel.countDocuments(filter),
  ]);
  return { items: docs.map(toDto), meta: buildMeta(page, total) };
}

/** Only customers who received the product may review it; reviews wait for moderation. */
export async function createReview(userId: string, slug: string, input: z.infer<typeof reviewInputSchema>) {
  const product = await getPublishedProductRef({ slug });
  if (!(await hasDeliveredProduct(userId, product.id))) {
    throw ApiError.forbidden("Only customers who received this product can review it");
  }
  const user = await getUserOrThrow(userId);
  const doc = await ReviewModel.create({
    ...input,
    product: product.id,
    user: userId,
    authorName: user.name.split(" ")[0],
    isVerifiedPurchase: true,
  });
  return toDto(doc);
}

export async function listReviewsForModeration(status: ReviewStatus | undefined, page: PaginationQuery) {
  const filter = status ? { status } : {};
  const [docs, total] = await Promise.all([
    ReviewModel.find(filter).populate("product", "slug name").sort({ createdAt: -1 }).skip(toSkip(page)).limit(page.limit),
    ReviewModel.countDocuments(filter),
  ]);
  const items = docs.map((doc) => ({ ...toDto(doc), status: doc.status, product: doc.product }));
  return { items, meta: buildMeta(page, total) };
}

export async function moderateReview(id: string, status: ReviewStatus) {
  const doc = await ReviewModel.findById(id).populate<{ product: { _id: Types.ObjectId; slug: string } }>("product", "slug");
  if (!doc) throw ApiError.notFound("Review");
  doc.status = status;
  await doc.save();

  await refreshRating(String(doc.product._id));
  waitUntil(revalidateFrontend([CACHE_TAGS.reviews(doc.product.slug)]));
  return { id: doc.id, status: doc.status };
}
