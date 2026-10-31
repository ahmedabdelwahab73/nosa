import { z } from "zod";
import { PAYMENT_METHODS } from "./enums";
import { localizedTextSchema } from "./i18n";
import { phoneSchema } from "./phone";

export const settingsInputSchema = z.object({
  storeName: localizedTextSchema,
  contact: z.object({
    phone: phoneSchema.optional(),
    whatsapp: phoneSchema.optional(),
    email: z.email().optional(),
    address: localizedTextSchema.partial().optional(),
  }),
  socials: z.object({
    instagram: z.url().optional(),
    facebook: z.url().optional(),
    tiktok: z.url().optional(),
  }),
  checkout: z.object({
    allowGuest: z.boolean(),
    enabledPaymentMethods: z.array(z.enum(PAYMENT_METHODS)).min(1),
    freeShippingThreshold: z.number().nonnegative().nullable(),
  }),
  inventory: z.object({ lowStockThreshold: z.number().int().min(0) }),
  announcement: z.object({ enabled: z.boolean(), text: localizedTextSchema.partial() }),
  maintenanceMode: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsInputSchema>;
export type SettingsDto = SettingsInput & { updatedAt: string };

/** The subset the storefront may see. */
export type PublicSettingsDto = Pick<SettingsDto, "storeName" | "contact" | "socials" | "announcement" | "maintenanceMode"> & {
  checkout: Pick<SettingsDto["checkout"], "allowGuest" | "enabledPaymentMethods" | "freeShippingThreshold">;
};
