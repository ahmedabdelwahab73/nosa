"use client";

import { Layers, Sparkles } from "lucide-react";
import { Panel } from "@/shared/components/panel";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { OptionValuesEditor } from "../option-values-editor";
import type { SectionProps } from "../lib/section-props";
import type { VariantDraft } from "../lib/product-draft";
import { generateVariants, slugify } from "../lib/variants";

export function ProductVariantsSection({ form, labels, locale }: SectionProps) {
  const { draft, update, error } = form;
  const t = labels.variants;

  const labelOf = (kind: "sizes" | "colors", value: string | undefined) =>
    draft[kind].find((option) => option.value === value)?.label[locale] ?? "—";

  const regenerate = () =>
    update((d) => ({
      ...d,
      variants: generateVariants(d.sizes, d.colors, d.variants, slugify(d.slug || d.name.en).split("-").slice(0, 2).join("-")),
    }));

  const patchVariant = (index: number, change: Partial<VariantDraft>) =>
    update((d) => ({ ...d, variants: d.variants.map((variant, i) => (i === index ? { ...variant, ...change } : variant)) }));

  return (
    <Panel title={t.title} icon={<Layers />}>
      <OptionValuesEditor
        title={t.sizes}
        kind="size"
        values={draft.sizes}
        onChange={(sizes) => update((d) => ({ ...d, sizes }))}
        locale={locale}
        labels={t}
        example={t.sizeExample}
      />
      <OptionValuesEditor
        title={t.colors}
        kind="color"
        values={draft.colors}
        onChange={(colors) => update((d) => ({ ...d, colors }))}
        locale={locale}
        labels={t}
        example={t.colorExample}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={regenerate} disabled={!draft.sizes.length && !draft.colors.length}>
          <Sparkles />
          {t.generate}
        </Button>
        <span className="text-sm text-muted-foreground">{t.regenerateHint}</span>
      </div>

      {draft.variants.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.sku}</TableHead>
              {draft.sizes.length > 0 && <TableHead>{t.size}</TableHead>}
              {draft.colors.length > 0 && <TableHead>{t.color}</TableHead>}
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.stock}</TableHead>
              <TableHead>{t.madeToOrder}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draft.variants.map((variant, index) => (
              <TableRow key={variant.sku + index}>
                <TableCell>
                  <Input className="w-40" dir="ltr" value={variant.sku} aria-label={t.sku} aria-invalid={!!error(`variants.${index}.sku`)}
                    onChange={(event) => patchVariant(index, { sku: event.target.value })} />
                </TableCell>
                {draft.sizes.length > 0 && <TableCell>{labelOf("sizes", variant.optionValues.size)}</TableCell>}
                {draft.colors.length > 0 && <TableCell>{labelOf("colors", variant.optionValues.color)}</TableCell>}
                <TableCell>
                  <Input className="w-24" type="number" min={0} step="0.01" dir="ltr" value={variant.price} placeholder={t.priceHint} aria-label={t.price}
                    onChange={(event) => patchVariant(index, { price: event.target.value })} />
                </TableCell>
                <TableCell>
                  <Input className="w-20" type="number" min={0} step={1} dir="ltr" value={variant.stock} disabled={variant.isMadeToOrder} aria-label={t.stock}
                    onChange={(event) => patchVariant(index, { stock: event.target.value })} />
                </TableCell>
                <TableCell>
                  <Switch checked={variant.isMadeToOrder} aria-label={t.madeToOrder} onCheckedChange={(isMadeToOrder) => patchVariant(index, { isMadeToOrder })} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="rounded-xl bg-muted/60 px-4 py-6 text-center text-sm text-muted-foreground">{t.empty}</p>
      )}
      {error("variants") && <p className="text-sm text-destructive">{error("variants")}</p>}
    </Panel>
  );
}
