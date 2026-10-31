import { waitUntil } from "@vercel/functions";
import { CACHE_TAGS, type PublicSettingsDto, type SettingsDto, type SettingsInput } from "@nosa/contracts";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { DEFAULT_SETTINGS, SettingsModel } from "./settings.model";

/** Creates the singleton with defaults on first read. */
async function loadSettings() {
  const doc = await SettingsModel.findOneAndUpdate(
    { key: "store" },
    { $setOnInsert: { key: "store", ...DEFAULT_SETTINGS } },
    { upsert: true, new: true },
  );
  const { id: _id, key: _key, createdAt: _c, ...settings } = doc.toJSON() as Record<string, unknown>;
  // Mongoose drops empty nested objects, but the contract promises these always exist.
  const announcement = settings.announcement as { enabled: boolean; text?: unknown };
  return {
    ...settings,
    contact: settings.contact ?? {},
    socials: settings.socials ?? {},
    announcement: { ...announcement, text: announcement.text ?? {} },
  } as unknown as SettingsDto;
}

export const getSettings = loadSettings;

export async function getPublicSettings(): Promise<PublicSettingsDto> {
  const { storeName, contact, socials, announcement, maintenanceMode, checkout } = await loadSettings();
  return { storeName, contact, socials, announcement, maintenanceMode, checkout };
}

export async function updateSettings(input: SettingsInput) {
  await SettingsModel.updateOne({ key: "store" }, { $set: input }, { upsert: true, runValidators: true });
  waitUntil(revalidateFrontend([CACHE_TAGS.settings]));
  return loadSettings();
}
