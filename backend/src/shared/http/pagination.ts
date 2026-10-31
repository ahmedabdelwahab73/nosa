import { z } from "zod";
import type { PaginationMeta } from "@nosa/contracts";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const toSkip = ({ page, limit }: PaginationQuery) => (page - 1) * limit;

export const buildMeta = ({ page, limit }: PaginationQuery, total: number): PaginationMeta => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});
