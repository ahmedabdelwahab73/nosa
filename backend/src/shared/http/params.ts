import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "INVALID_ID");

export const idParamsSchema = z.object({ id: objectIdSchema });
export const slugParamsSchema = z.object({ slug: z.string().trim().min(1).max(120) });
