import { connection } from "next/server";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { requireRole } from "@/shared/lib/auth";
import { SettingsForm } from "../settings-form";
import { getSettingsDraft } from "./settings-page.data";

export async function SettingsPage() {
  await connection();
  const locale = await getLocale();
  // Only admins and owners can change settings; anyone else gets the 403 page.
  await requireRole(locale, ["admin", "owner"], `/${locale}/dashboard/settings`);
  const [dict, messages, initial] = await Promise.all([getDictionary(), getFeedbackMessages(), getSettingsDraft()]);

  return (
    <SettingsForm
      initial={initial}
      labels={dict.dashboard.settings}
      languages={dict.dashboard.productForm.languages}
      invalidMessage={dict.dashboard.productForm.invalid}
      messages={messages}
    />
  );
}
