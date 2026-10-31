import { Router } from "express";
import { wishlistToggleSchema } from "@nosa/contracts";
import { requireAuth } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./wishlist.controller";

export const wishlistRoutes = Router();

wishlistRoutes.use(requireAuth);
wishlistRoutes.get("/", controller.get);
wishlistRoutes.post("/toggle", validate({ body: wishlistToggleSchema }), controller.toggle);
