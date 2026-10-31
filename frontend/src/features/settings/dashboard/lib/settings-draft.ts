import type { LocalizedText, PaymentMethod, SettingsDto } from "@nosa/contracts";

/** What the settings form edits (numbers and empty optional fields as plain strings). */
export type SettingsDraft = {
  storeName: LocalizedText;
  phone: string;
  whatsapp: string;
  email: string;
  address: LocalizedText;
  instagram: string;
  facebook: string;
  tiktok: string;
  allowGuest: boolean;
  paymentMethods: PaymentMethod[];
  /** "" means no free shipping. */
  freeShippingThreshold: string;
  lowStockThreshold: string;
  announcementEnabled: boolean;
  announcementText: LocalizedText;
  maintenanceMode: boolean;
};

const text = (value: Partial<LocalizedText> | undefined): LocalizedText => ({ ar: value?.ar ?? "", en: value?.en ?? "" });

export const draftFromSettings = (settings: SettingsDto): SettingsDraft => ({
  storeName: text(settings.storeName),
  phone: settings.contact.phone ?? "",
  whatsapp: settings.contact.whatsapp ?? "",
  email: settings.contact.email ?? "",
  address: text(settings.contact.address),
  instagram: settings.socials.instagram ?? "",
  facebook: settings.socials.facebook ?? "",
  tiktok: settings.socials.tiktok ?? "",
  allowGuest: settings.checkout.allowGuest,
  paymentMethods: settings.checkout.enabledPaymentMethods,
  freeShippingThreshold: settings.checkout.freeShippingThreshold === null ? "" : String(settings.checkout.freeShippingThreshold),
  lowStockThreshold: String(settings.inventory.lowStockThreshold),
  announcementEnabled: settings.announcement.enabled,
  announcementText: text(settings.announcement.text),
  maintenanceMode: settings.maintenanceMode,
});

const optional = (value: string) => (value.trim() === "" ? undefined : value.trim());
const partial = (value: LocalizedText) => ({
  ...(value.ar.trim() && { ar: value.ar.trim() }),
  ...(value.en.trim() && { en: value.en.trim() }),
});

/** Ready for `settingsInputSchema.safeParse` (and the API): empty optional fields are left out. */
export function toSettingsInput(draft: SettingsDraft) {
  const threshold = optional(draft.freeShippingThreshold);
  return {
    storeName: draft.storeName,
    contact: {
      phone: optional(draft.phone),
      whatsapp: optional(draft.whatsapp),
      email: optional(draft.email),
      address: partial(draft.address),
    },
    socials: {
      instagram: optional(draft.instagram),
      facebook: optional(draft.facebook),
      tiktok: optional(draft.tiktok),
    },
    checkout: {
      allowGuest: draft.allowGuest,
      enabledPaymentMethods: draft.paymentMethods,
      freeShippingThreshold: threshold === undefined ? null : Number(threshold),
    },
    inventory: { lowStockThreshold: Number(draft.lowStockThreshold) },
    announcement: { enabled: draft.announcementEnabled, text: partial(draft.announcementText) },
    maintenanceMode: draft.maintenanceMode,
  };
}
