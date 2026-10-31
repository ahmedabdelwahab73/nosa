import { Router } from "express";
import { addCartItemSchema, applyCouponSchema, updateCartItemSchema } from "@nosa/contracts";
import { idParamsSchema } from "@/shared/http/params";
import { optionalAuth, requireAuth } from "@/shared/middlewares/auth";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./cart.controller";

export const cartRoutes = Router();

cartRoutes.use(optionalAuth);
cartRoutes.get("/", controller.get);
cartRoutes.post("/items", validate({ body: addCartItemSchema }), controller.addItem);
cartRoutes.patch("/items/:id", validate({ params: idParamsSchema, body: updateCartItemSchema }), controller.updateItem);
cartRoutes.delete("/items/:id", validate({ params: idParamsSchema }), controller.removeItem);
cartRoutes.post(
  "/coupon",
  rateLimit({ name: "coupon", max: 15, windowSeconds: 60 * 10 }),
  validate({ body: applyCouponSchema }),
  controller.applyCoupon,
);
cartRoutes.delete("/coupon", controller.removeCoupon);
cartRoutes.post("/merge", requireAuth, controller.merge);
