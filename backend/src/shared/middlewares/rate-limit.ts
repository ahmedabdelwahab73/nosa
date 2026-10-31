import type { Request, RequestHandler } from "express";
import { Schema, model } from "mongoose";
import { isTest } from "@/config/env";
import { ApiError } from "@/shared/http/api-error";

/**
 * Fixed-window rate limit stored in MongoDB, because serverless instances don't share memory.
 * A TTL index removes old windows automatically.
 */
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const RateLimit = model("RateLimit", rateLimitSchema);

type Options = {
  name: string;
  max: number;
  windowSeconds: number;
  /** What identifies the caller; defaults to the client IP. */
  by?: (req: Request) => string;
};

const clientIp = (req: Request) =>
  req.header("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";

export const rateLimit =
  ({ name, max, windowSeconds, by = clientIp }: Options): RequestHandler =>
  async (req, res, next) => {
    if (isTest) return next();

    const window = Math.floor(Date.now() / (windowSeconds * 1000));
    const key = `${name}:${by(req)}:${window}`;
    const entry = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * windowSeconds * 1000) } },
      { upsert: true, new: true },
    );

    res.setHeader("RateLimit-Remaining", Math.max(0, max - entry.count));
    if (entry.count > max) return next(new ApiError("RATE_LIMITED", "Too many requests"));
    next();
  };
