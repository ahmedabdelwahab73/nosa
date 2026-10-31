import type { Response } from "express";
import type { ApiSuccess, PaginationMeta } from "@nosa/contracts";

export function sendSuccess<T>(res: Response, data: T, status = 200, meta?: PaginationMeta) {
  const body: ApiSuccess<T> = { success: true, data, ...(meta && { meta }) };
  return res.status(status).json(body);
}
