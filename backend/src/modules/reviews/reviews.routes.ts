import { Router } from "express";
import { REVIEW_STATUSES, reviewInputSchema, reviewModerationSchema } from "@nosa/contracts";
import { z } from "zod";
import { paginationQuerySchema } from "@/shared/http/pagination";
import { idParamsSchema, slugParamsSchema } from "@/shared/http/params";
import { requireAuth, requireRole } from "@/shared/middlewares/auth";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./reviews.controller";

/** Mounted under /products/:slug/reviews. */
export const reviewsRoutes = Router({ mergeParams: true });

reviewsRoutes.get("/", validate({ params: slugParamsSchema, query: paginationQuerySchema }), controller.list);
reviewsRoutes.post(
  "/",
  requireAuth,
  rateLimit({ name: "review", max: 5, windowSeconds: 60 * 60 }),
  validate({ params: slugParamsSchema, body: reviewInputSchema }),
  controller.create,
);

export const reviewsDashboardRoutes = Router();

reviewsDashboardRoutes.get(
  "/",
  validate({ query: paginationQuerySchema.extend({ status: z.enum(REVIEW_STATUSES).optional() }) }),
  controller.moderationList,
);
reviewsDashboardRoutes.patch(
  "/:id",
  requireRole("editor", "admin", "owner"),
  validate({ params: idParamsSchema, body: reviewModerationSchema }),
  controller.moderate,
);
