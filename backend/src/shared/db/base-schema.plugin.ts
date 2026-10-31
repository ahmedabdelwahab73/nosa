import type { Schema } from "mongoose";

/**
 * Applied to every schema: exposes `id` instead of `_id` and hides `__v`,
 * so API responses have one consistent shape.
 */
export function baseSchemaPlugin(schema: Schema) {
  const transform = (_doc: unknown, ret: Record<string, unknown>) => {
    // Sub-schemas declared with `_id: false` (localized text, images...) have no id to expose.
    if (ret._id !== undefined) ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  };

  schema.set("toJSON", { virtuals: true, transform });
  schema.set("toObject", { virtuals: true, transform });
}
