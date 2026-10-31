"use client";

import { Coins } from "lucide-react";
import { Panel } from "@/shared/components/panel";
import { formatNumber } from "@/shared/lib/format";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import type { SectionProps } from "../lib/section-props";

export function ProductPricingSection({ form, labels, locale }: SectionProps) {
  const { draft, update, error } = form;
  const t = labels.pricing;
  const price = Number(draft.price);
  const sale = Number(draft.salePrice);
  const percent = price > 0 && sale > 0 && sale < price ? Math.round((1 - sale / price) * 100) : 0;
  const hasVariants = draft.variants.length > 0;

  return (
    <Panel title={t.title} icon={<Coins />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!error("price")}>
          <FieldLabel htmlFor="price">{t.price} <span className="text-destructive">*</span></FieldLabel>
          <Input id="price" type="number" inputMode="decimal" min={0} step="0.01" dir="ltr" value={draft.price} aria-invalid={!!error("price")}
            onChange={(event) => update((d) => ({ ...d, price: event.target.value }))} />
          {error("price") && <FieldError>{error("price")}</FieldError>}
        </Field>
        <Field data-invalid={!!error("salePrice")}>
          <FieldLabel htmlFor="salePrice">
            {t.salePrice}
            {percent > 0 && <span className="ms-2 rounded-full bg-yarn-50 px-2 py-0.5 text-xs text-yarn-600">{t.save.replace("{percent}", formatNumber(percent, locale))}</span>}
          </FieldLabel>
          <Input id="salePrice" type="number" inputMode="decimal" min={0} step="0.01" dir="ltr" value={draft.salePrice} aria-invalid={!!error("salePrice")}
            onChange={(event) => update((d) => ({ ...d, salePrice: event.target.value }))} />
          {error("salePrice") && <FieldError>{error("salePrice")}</FieldError>}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {hasVariants ? (
          <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground sm:col-span-2">{t.variantsNote}</p>
        ) : (
          <>
            <Field data-invalid={!!error("stock")}>
              <FieldLabel htmlFor="stock">{t.stock}</FieldLabel>
              <Input id="stock" type="number" inputMode="numeric" min={0} step={1} dir="ltr" value={draft.stock} disabled={draft.isMadeToOrder}
                onChange={(event) => update((d) => ({ ...d, stock: event.target.value }))} />
              {error("stock") && <FieldError>{error("stock")}</FieldError>}
            </Field>
            <Field orientation="horizontal" className="items-center">
              <Switch id="madeToOrder" checked={draft.isMadeToOrder} onCheckedChange={(isMadeToOrder) => update((d) => ({ ...d, isMadeToOrder }))} />
              <div>
                <FieldLabel htmlFor="madeToOrder">{t.madeToOrder}</FieldLabel>
                <FieldDescription>{t.madeToOrderHint}</FieldDescription>
              </div>
            </Field>
          </>
        )}
        <Field data-invalid={!!error("productionDays")}>
          <FieldLabel htmlFor="productionDays">{t.productionDays}</FieldLabel>
          <Input id="productionDays" type="number" inputMode="numeric" min={0} max={60} step={1} dir="ltr" value={draft.productionDays}
            onChange={(event) => update((d) => ({ ...d, productionDays: event.target.value }))} />
          <FieldDescription>{t.productionHint}</FieldDescription>
          {error("productionDays") && <FieldError>{error("productionDays")}</FieldError>}
        </Field>
      </div>
    </Panel>
  );
}
