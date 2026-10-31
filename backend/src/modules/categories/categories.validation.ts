import { z } from "zod";
import { objectIdSchema } from "@/shared/http/params";

export const reorderSchema = z.object({ ids: z.array(objectIdSchema).min(1).max(500) });
