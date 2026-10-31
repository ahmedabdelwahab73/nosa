import { Schema, model } from "mongoose";
import { PAYMENT_METHODS } from "@nosa/contracts";
import { localizedTextSchema, requiredLocalizedTextSchema } from "@/shared/db/schemas";

/** Singleton document (`key: "store"`) holding store-wide settings. */
const settingsSchema = new Schema(
  {
    key: { type: String, default: "store", unique: true },
    storeName: { type: requiredLocalizedTextSchema, required: true },
    contact: {
      phone: String,
      whatsapp: String,
      email: String,
      address: localizedTextSchema,
    },
    socials: { instagram: String, facebook: String, tiktok: String },
    checkout: {
      allowGuest: { type: Boolean, default: true },
      enabledPaymentMethods: { type: [String], enum: PAYMENT_METHODS, default: ["cod"] },
      freeShippingThreshold: { type: Number, default: null },
    },
    inventory: { lowStockThreshold: { type: Number, default: 3 } },
    announcement: { enabled: { type: Boolean, default: false }, text: localizedTextSchema },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SettingsModel = model("Settings", settingsSchema);

export const DEFAULT_SETTINGS = {
  storeName: { ar: "نوسة للمشغولات اليدوية", en: "Nosa Handmade Crafts" },
  contact: {},
  socials: {},
  checkout: { allowGuest: true, enabledPaymentMethods: ["cod"], freeShippingThreshold: null },
  inventory: { lowStockThreshold: 3 },
  announcement: { enabled: false, text: {} },
  maintenanceMode: false,
};
