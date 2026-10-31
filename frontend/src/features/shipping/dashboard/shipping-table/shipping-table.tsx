"use client";

import type { GovernorateDto, Locale } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useShippingTable } from "./shipping-table.ux";

type ShippingTableProps = {
  rates: GovernorateDto[];
  locale: Locale;
  labels: Dictionary["dashboard"]["shipping"];
  messages: FeedbackMessages;
};

const numberInput = "h-9 w-20 text-center tabular-nums";

export function ShippingTable({ rates, locale, labels, messages }: ShippingTableProps) {
  const table = useShippingTable(rates, messages);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labels.columns.governorate}</TableHead>
          <TableHead>{labels.columns.fee}</TableHead>
          <TableHead>{labels.columns.days}</TableHead>
          <TableHead>{labels.columns.delivers}</TableHead>
          <TableHead className="text-end">{labels.columns.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((rate) => {
          const draft = table.draftOf(rate.code);
          const saving = table.savingCode === rate.code;
          return (
            <TableRow key={rate.code}>
              <TableCell className="font-medium">{rate.name[locale]}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  className={numberInput}
                  aria-label={`${labels.columns.fee}: ${rate.name[locale]}`}
                  value={draft.fee}
                  onChange={(event) => table.change(rate.code, { fee: event.target.value })}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    className={numberInput}
                    aria-label={`${labels.from}: ${rate.name[locale]}`}
                    value={draft.min}
                    onChange={(event) => table.change(rate.code, { min: event.target.value })}
                  />
                  <span aria-hidden>–</span>
                  <Input
                    type="number"
                    min={0}
                    className={numberInput}
                    aria-label={`${labels.to}: ${rate.name[locale]}`}
                    value={draft.max}
                    onChange={(event) => table.change(rate.code, { max: event.target.value })}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={draft.isActive}
                  onCheckedChange={(isActive) => table.change(rate.code, { isActive })}
                  aria-label={`${labels.columns.delivers}: ${rate.name[locale]}`}
                />
              </TableCell>
              <TableCell className="text-end">
                <Button size="sm" disabled={!table.isDirty(rate.code) || saving} onClick={() => table.save(rate.code)}>
                  {saving && <Spinner />}
                  {labels.save}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
