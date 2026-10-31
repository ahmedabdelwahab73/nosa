import { Router } from "express";
import { z } from "zod";
import { shippingRateInputSchema } from "@nosa/contracts";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./shipping.controller";

export const shippingRoutes = Router();
shippingRoutes.get("/governorates", controller.governorates);

export const shippingDashboardRoutes = Router();
shippingDashboardRoutes.get("/governorates", controller.allGovernorates);
shippingDashboardRoutes.put(
  "/governorates/:code",
  requireRole("admin", "owner"),
  validate({ params: z.object({ code: z.string().min(2).max(40) }), body: shippingRateInputSchema }),
  controller.updateRate,
);
