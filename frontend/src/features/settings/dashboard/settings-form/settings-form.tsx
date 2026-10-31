"use client";

import { Boxes, Megaphone, Phone, Share2, ShieldAlert, ShoppingCart, Store } from "lucide-react";
import { PAYMENT_METHODS, type Locale } from "@nosa/contracts";
import { LocalizedInput } from "@/shared/components/localized-input";
import { Panel } from "@/shared/components/panel";
import { TextField } from "@/shared/components/text-field";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import type { SettingsDraft } from "../lib/settings-draft";
import { useSettingsForm } from "./settings-form.ux";

type SettingsFormProps = {
  initial: SettingsDraft;
  labels: Dictionary["dashboard"]["settings"];
  languages: Record<Locale, string>;
  invalidMessage: string;
  messages: FeedbackMessages;
};

/** Only cash on delivery is live; the others wait for the payment gateway decision. */
const LIVE_METHODS = ["cod"] as const;

export function SettingsForm({ initial, labels: t, languages, invalidMessage, messages }: SettingsFormProps) {
  const form = useSettingsForm({ initial, messages, errorLabels: t.errors, invalidMessage });
  const { draft, update, error } = form;
  const set = <K extends keyof SettingsDraft>(key: K) => (value: SettingsDraft[K]) => update((d) => ({ ...d, [key]: value }));

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-primary-800 sm:text-3xl">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button size="lg" className="h-10 px-5" disabled={form.pending} onClick={form.save}>
          {form.pending && <Spinner />}
          {t.save}
        </Button>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Panel title={t.store.title} icon={<Store />}>
            <LocalizedInput label={t.store.name} required value={draft.storeName} onChange={set("storeName")} languageLabels={languages} errors={{ ar: error("storeName.ar"), en: error("storeName.en") }} />
          </Panel>

          <Panel title={t.contact.title} icon={<Phone />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label={t.contact.phone} type="tel" dir="ltr" value={draft.phone} onValueChange={set("phone")} error={error("contact.phone")} hint={t.contact.phoneHint} />
              <TextField label={t.contact.whatsapp} type="tel" dir="ltr" value={draft.whatsapp} onValueChange={set("whatsapp")} error={error("contact.whatsapp")} />
            </div>
            <TextField label={t.contact.email} type="email" dir="ltr" value={draft.email} onValueChange={set("email")} error={error("contact.email")} />
            <LocalizedInput label={t.contact.address} value={draft.address} onChange={set("address")} languageLabels={languages} />
          </Panel>

          <Panel title={t.socials.title} icon={<Share2 />}>
            <TextField label={t.socials.instagram} type="url" dir="ltr" placeholder="https://instagram.com/…" value={draft.instagram} onValueChange={set("instagram")} error={error("socials.instagram")} hint={t.socials.urlHint} />
            <TextField label={t.socials.facebook} type="url" dir="ltr" placeholder="https://facebook.com/…" value={draft.facebook} onValueChange={set("facebook")} error={error("socials.facebook")} />
            <TextField label={t.socials.tiktok} type="url" dir="ltr" placeholder="https://tiktok.com/@…" value={draft.tiktok} onValueChange={set("tiktok")} error={error("socials.tiktok")} />
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title={t.checkout.title} icon={<ShoppingCart />}>
            <Field orientation="horizontal" className="items-center">
              <Switch id="allowGuest" checked={draft.allowGuest} onCheckedChange={set("allowGuest")} />
              <div>
                <FieldLabel htmlFor="allowGuest">{t.checkout.allowGuest}</FieldLabel>
                <FieldDescription>{t.checkout.allowGuestHint}</FieldDescription>
              </div>
            </Field>

            <Field>
              <FieldLabel>{t.checkout.payments}</FieldLabel>
              <ul className="flex flex-col divide-y rounded-2xl border">
                {PAYMENT_METHODS.map((method) => {
                  const live = (LIVE_METHODS as readonly string[]).includes(method);
                  return (
                    <li key={method} className="flex items-center gap-3 px-4 py-3">
                      <span className="flex-1 text-sm font-medium">{t.checkout.methods[method]}</span>
                      <span className="text-xs text-muted-foreground">{live ? t.checkout.alwaysOn : t.checkout.soon}</span>
                      <Switch checked={live && draft.paymentMethods.includes(method)} disabled aria-label={t.checkout.methods[method]} />
                    </li>
                  );
                })}
              </ul>
            </Field>

            <TextField label={t.checkout.freeShipping} type="number" min={0} step="0.01" dir="ltr" value={draft.freeShippingThreshold} onValueChange={set("freeShippingThreshold")} error={error("checkout.freeShippingThreshold")} hint={t.checkout.freeShippingHint} />
          </Panel>

          <Panel title={t.inventory.title} icon={<Boxes />}>
            <TextField label={t.inventory.lowStock} type="number" min={0} step={1} dir="ltr" className="max-w-48" value={draft.lowStockThreshold} onValueChange={set("lowStockThreshold")} error={error("inventory.lowStockThreshold")} hint={t.inventory.lowStockHint} />
          </Panel>

          <Panel title={t.announcement.title} icon={<Megaphone />}>
            <Field orientation="horizontal" className="items-center">
              <Switch id="announcement" checked={draft.announcementEnabled} onCheckedChange={set("announcementEnabled")} />
              <FieldLabel htmlFor="announcement">{t.announcement.enabled}</FieldLabel>
            </Field>
            <LocalizedInput label={t.announcement.text} value={draft.announcementText} onChange={set("announcementText")} languageLabels={languages} maxLength={160} />
          </Panel>

          <Panel title={t.maintenance.title} icon={<ShieldAlert />}>
            <Field orientation="horizontal" className="items-center">
              <Switch id="maintenance" checked={draft.maintenanceMode} onCheckedChange={set("maintenanceMode")} />
              <div>
                <FieldLabel htmlFor="maintenance">{t.maintenance.enabled}</FieldLabel>
                <FieldDescription>{t.maintenance.hint}</FieldDescription>
              </div>
            </Field>
          </Panel>
        </div>
      </div>
    </div>
  );
}
