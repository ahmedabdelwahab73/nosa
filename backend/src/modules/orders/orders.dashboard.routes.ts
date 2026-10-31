import { Router } from "express";
import { orderDashboardQuerySchema, orderNoteSchema, updateOrderStatusSchema } from "@nosa/contracts";
import { idParamsSchema } from "@/shared/http/params";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./orders.controller";

/** All dashboard roles handle orders (staff included). */
export const ordersDashboardRoutes = Router();

ordersDashboardRoutes.get("/", validate({ query: orderDashboardQuerySchema }), controller.list);
ordersDashboardRoutes.get("/:id", validate({ params: idParamsSchema }), controller.detail);
ordersDashboardRoutes.patch("/:id/status", validate({ params: idParamsSchema, body: updateOrderStatusSchema }), controller.updateStatus);
ordersDashboardRoutes.post("/:id/notes", validate({ params: idParamsSchema, body: orderNoteSchema }), controller.addNote);
