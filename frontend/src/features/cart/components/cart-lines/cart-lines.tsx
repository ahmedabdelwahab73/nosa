"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartLineDto, Locale } from "@nosa/contracts";
import { MediaImage } from "@/shared/components/media-image";
import { Price } from "@/shared/components/price";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { formatPrice } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { useCartLines } from "./cart-lines.ux";

type CartLinesProps = {
  lines: CartLineDto[];
  locale: Locale;
  labels: Dictionary["store"]["cart"];
  messages: FeedbackMessages;
};

export function CartLines({ lines, locale, labels, messages }: CartLinesProps) {
  const cart = useCartLines(lines, messages);

  return (
    <ul className="flex flex-col gap-4">
      {cart.lines.map((line) => {
        const name = line.name[locale];
        const details = [...line.optionLabels.map((label) => label[locale]), ...(line.isMadeToOrder ? [labels.madeToOrder] : [])];
        const custom = Object.values(line.customization).filter(Boolean);

        return (
          <li key={line.id} className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl border bg-card p-3 shadow-card sm:grid-cols-[7rem_1fr] sm:p-4">
            <Link href={`/${locale}/product/${line.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted">
              <MediaImage image={line.image} alt={line.image?.alt?.[locale] || name} fill sizes="112px" />
            </Link>

            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/${locale}/product/${line.slug}`} className="line-clamp-2 font-medium hover:text-primary-700">{name}</Link>
                  {details.length > 0 && <p className="text-sm text-muted-foreground">{details.join(" · ")}</p>}
                  {custom.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {labels.customization}: {custom.join(" · ")}
                    </p>
                  )}
                </div>
                <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 text-destructive" onClick={() => cart.remove(line)} aria-label={`${labels.remove}: ${name}`} title={labels.remove}>
                  <Trash2 />
                </Button>
              </div>

              {!line.available && <p className="text-sm font-medium text-yarn-500">{labels.unavailable}</p>}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-full border bg-background" role="group" aria-label={name}>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => cart.setQuantity(line, line.quantity - 1)} disabled={line.quantity <= 1} aria-label={labels.decrease}>
                    <Minus />
                  </Button>
                  <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">{line.quantity}</span>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => cart.setQuantity(line, line.quantity + 1)} disabled={line.quantity >= line.maxQuantity} aria-label={labels.increase}>
                    <Plus />
                  </Button>
                </div>
                <div className="flex flex-col items-end text-end">
                  <span className="font-semibold">{formatPrice(line.lineTotal, locale)}</span>
                  {line.quantity > 1 && <Price amount={line.unitPrice} locale={locale} size="sm" className="text-muted-foreground [&>span]:font-normal [&>span]:text-muted-foreground" />}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
