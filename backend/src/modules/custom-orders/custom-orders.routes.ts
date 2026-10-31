import { Router } from "express";
import { z } from "zod";
import { CUSTOM_ORDER_STATUSES, customOrderInputSchema, customOrderQuoteSchema, customOrderStatusSchema } from "@nosa/contracts";
import { paginationQuerySchema } from "@/shared/http/pagination";
import { idParamsSchema } from "@/shared/http/params";
import { optionalAuth, requireAuth } from "@/shared/middlewares/auth";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./custom-orders.controller";

export const customOrdersRoutes = Router();

customOrdersRoutes.post(
  "/",
  rateLimit({ name: "custom-order", max: 5, windowSeconds: 60 * 60 }),
  optionalAuth,
  validate({ body: customOrderInputSchema }),
  controller.create,
);
customOrdersRoutes.get("/me", requireAuth, controller.mine);
customOrdersRoutes.post(
  "/me/:number/respond",
  requireAuth,
  validate({ params: z.object({ number: z.string().min(5).max(30) }), body: z.object({ accept: z.boolean() }) }),
  controller.respond,
);

export const customOrdersDashboardRoutes = Router();

customOrdersDashboardRoutes.get(
  "/",
  validate({ query: paginationQuerySchema.extend({ status: z.enum(CUSTOM_ORDER_STATUSES).optional() }) }),
  controller.list,
);
customOrdersDashboardRoutes.get("/:id", validate({ params: idParamsSchema }), controller.detail);
customOrdersDashboardRoutes.post("/:id/quote", validate({ params: idParamsSchema, body: customOrderQuoteSchema }), controller.quote);
customOrdersDashboardRoutes.patch("/:id/status", validate({ params: idParamsSchema, body: customOrderStatusSchema }), controller.updateStatus);
