"use client";

import type { OrderStatus } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { Textarea } from "@/shared/ui/textarea";
import { useOrderStatusPanel } from "./order-status-panel.ux";

type OrderStatusPanelProps = {
  orderId: string;
  allowed: OrderStatus[];
  labels: Dictionary["dashboard"]["orders"]["detail"]["status"];
  orderStatus: Dictionary["orderStatus"];
  messages: FeedbackMessages;
};

/** Only the statuses the order may move to next are offered; Express checks the same rule. */
export function OrderStatusPanel({ orderId, allowed, labels, orderStatus, messages }: OrderStatusPanelProps) {
  const panel = useOrderStatusPanel(orderId, messages);

  if (!allowed.length) return <p className="text-sm text-muted-foreground">{labels.final}</p>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label>{labels.next}</Label>
        <Select value={panel.status} onValueChange={(value) => panel.setStatus(value as OrderStatus)}>
          <SelectTrigger className="h-10 w-full bg-card">
            <SelectValue placeholder={labels.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {allowed.map((status) => (
              <SelectItem key={status} value={status}>
                {orderStatus[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status-note">{labels.note}</Label>
        <Textarea id="status-note" rows={2} maxLength={500} value={panel.note} onChange={(event) => panel.setNote(event.target.value)} />
      </div>
      <Button onClick={panel.apply} disabled={!panel.status || panel.pending}>
        {panel.pending && <Spinner />}
        {labels.apply}
      </Button>
    </div>
  );
}
