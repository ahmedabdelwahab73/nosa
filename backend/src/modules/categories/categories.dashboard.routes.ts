import { Router } from "express";
import { categoryInputSchema } from "@nosa/contracts";
import { idParamsSchema } from "@/shared/http/params";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./categories.controller";
import { reorderSchema } from "./categories.validation";

export const categoriesDashboardRoutes = Router();

const editors = requireRole("editor", "admin", "owner");

categoriesDashboardRoutes.get("/", controller.listAll);
categoriesDashboardRoutes.post("/", editors, validate({ body: categoryInputSchema }), controller.create);
categoriesDashboardRoutes.put("/reorder", editors, validate({ body: reorderSchema }), controller.reorder);
categoriesDashboardRoutes.put("/:id", editors, validate({ params: idParamsSchema, body: categoryInputSchema }), controller.update);
categoriesDashboardRoutes.delete("/:id", editors, validate({ params: idParamsSchema }), controller.remove);
