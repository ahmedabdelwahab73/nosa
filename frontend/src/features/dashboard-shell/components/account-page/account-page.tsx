import { KeyRound } from "lucide-react";
import { PageHeader } from "@/shared/components/page-header";
import { Panel } from "@/shared/components/panel";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { ChangePasswordForm } from "../change-password-form";

export async function AccountPage() {
  const [dict, messages] = await Promise.all([getDictionary(), getFeedbackMessages()]);
  const labels = dict.dashboard.account;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader title={labels.title} subtitle={labels.subtitle} />
      <Panel title={labels.save} icon={<KeyRound />}>
        <ChangePasswordForm labels={labels} invalidMessage={dict.dashboard.productForm.invalid} messages={messages} />
      </Panel>
    </div>
  );
}
