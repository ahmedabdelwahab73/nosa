import { Router } from "express";
import { couponInputSchema } from "@nosa/contracts";
import { idParamsSchema } from "@/shared/http/params";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./coupons.controller";

export const couponsDashboardRoutes = Router();

const managers = requireRole("admin", "owner");

couponsDashboardRoutes.get("/", controller.list);
couponsDashboardRoutes.post("/", managers, validate({ body: couponInputSchema }), controller.create);
couponsDashboardRoutes.put("/:id", managers, validate({ params: idParamsSchema, body: couponInputSchema }), controller.update);
couponsDashboardRoutes.delete("/:id", managers, validate({ params: idParamsSchema }), controller.remove);
