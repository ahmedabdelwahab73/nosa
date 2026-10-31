import { Router } from "express";
import { z } from "zod";
import { checkoutSchema, trackOrderSchema } from "@nosa/contracts";
import { optionalAuth, requireAuth } from "@/shared/middlewares/auth";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./orders.controller";

export const ordersRoutes = Router();

ordersRoutes.post(
  "/",
  rateLimit({ name: "checkout", max: 10, windowSeconds: 60 * 10 }),
  optionalAuth,
  validate({ body: checkoutSchema }),
  controller.checkout,
);
ordersRoutes.post("/track", rateLimit({ name: "track", max: 20, windowSeconds: 60 * 10 }), validate({ body: trackOrderSchema }), controller.track);
ordersRoutes.get("/me", requireAuth, controller.mine);
ordersRoutes.get("/me/:number", requireAuth, validate({ params: z.object({ number: z.string().min(5).max(30) }) }), controller.myOrder);
