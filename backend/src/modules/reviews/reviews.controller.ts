import type { RequestHandler } from "express";
import type { ReviewStatus } from "@nosa/contracts";
import { sendSuccess } from "@/shared/http/api-response";
import type { PaginationQuery } from "@/shared/http/pagination";
import { currentUser } from "@/shared/middlewares/auth";
import * as service from "./reviews.service";

export const list: RequestHandler = async (req, res) => {
  const { items, meta } = await service.listApprovedReviews(String(req.params.slug), res.locals.query as PaginationQuery);
  sendSuccess(res, items, 200, meta);
};

export const create: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createReview(currentUser(res.locals).id, String(req.params.slug), req.body), 201);
};

export const moderationList: RequestHandler = async (_req, res) => {
  const { status, ...page } = res.locals.query as PaginationQuery & { status?: ReviewStatus };
  const { items, meta } = await service.listReviewsForModeration(status, page);
  sendSuccess(res, items, 200, meta);
};

export const moderate: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.moderateReview(String(req.params.id), req.body.status));
};
