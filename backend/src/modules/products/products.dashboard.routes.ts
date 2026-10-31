import { Router } from "express";
import { bulkStatusSchema, productDashboardQuerySchema, productInputSchema } from "@nosa/contracts";
import { idParamsSchema } from "@/shared/http/params";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./products.controller";

export const productsDashboardRoutes = Router();

const editors = requireRole("editor", "admin", "owner");

productsDashboardRoutes.get("/", validate({ query: productDashboardQuerySchema }), controller.dashboardList);
productsDashboardRoutes.post("/", editors, validate({ body: productInputSchema }), controller.create);
productsDashboardRoutes.patch("/status", editors, validate({ body: bulkStatusSchema }), controller.bulkStatus);
productsDashboardRoutes.get("/:id", validate({ params: idParamsSchema }), controller.byId);
productsDashboardRoutes.put("/:id", editors, validate({ params: idParamsSchema, body: productInputSchema }), controller.update);
productsDashboardRoutes.post("/:id/duplicate", editors, validate({ params: idParamsSchema }), controller.duplicate);
productsDashboardRoutes.delete("/:id", requireRole("admin", "owner"), validate({ params: idParamsSchema }), controller.remove);
