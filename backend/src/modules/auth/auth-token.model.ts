import { Schema, model, Types } from "mongoose";

/**
 * Opaque tokens we hand out (refresh, password reset). Only the SHA-256 hash is stored.
 * Refresh tokens rotate on every use; all tokens of one login share a `family`, so reuse of
 * an already-used token revokes the whole family (stolen token protection).
 */
const authTokenSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["refresh", "reset"], required: true },
  tokenHash: { type: String, required: true, unique: true },
  family: { type: String, required: true, index: true },
  usedAt: Date,
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const AuthTokenModel = model("AuthToken", authTokenSchema);
