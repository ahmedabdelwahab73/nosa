import { connection } from "next/server";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { requireRole } from "@/shared/lib/auth";
import { TeamTable } from "../team-table";
import { listStaff } from "./team-page.data";

export async function TeamPage() {
  await connection();
  const locale = await getLocale();
  // Only admins and owners manage the team; anyone else gets the 403 page.
  const user = await requireRole(locale, ["admin", "owner"], `/${locale}/dashboard/staff`);
  const [dict, messages, members] = await Promise.all([getDictionary(), getFeedbackMessages(), listStaff()]);

  return (
    <TeamTable
      members={members}
      currentUserId={user.id}
      actorRole={user.role}
      locale={locale}
      labels={dict.dashboard.team}
      roleLabels={dict.dashboard.roles}
      invalidMessage={dict.dashboard.productForm.invalid}
      messages={messages}
    />
  );
}
