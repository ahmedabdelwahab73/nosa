import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { USER_ROLES } from "@nosa/contracts";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    /** Canonical +201XXXXXXXXX. Optional because Google users add it at their first order. */
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    avatar: String,
    providers: { type: [String], enum: ["phone", "google"], default: [] },
    role: { type: String, enum: USER_ROLES, default: "customer", index: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    /** True after an admin sets a temporary password. */
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ name: "text", phone: "text", email: "text" });

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;
export const UserModel = model("User", userSchema);
