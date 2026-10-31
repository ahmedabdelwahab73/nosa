import type { OrderStatus } from "@nosa/contracts";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

const tones: Record<OrderStatus, string> = {
  pending: "bg-warning-50 text-warning",
  confirmed: "bg-primary-100 text-primary-800",
  in_production: "bg-blush text-primary-700",
  ready: "bg-primary-50 text-primary-600",
  shipped: "bg-info-50 text-info",
  delivered: "bg-success-50 text-success",
  cancelled: "bg-yarn-50 text-yarn-600",
  returned: "bg-muted text-muted-foreground",
};

type StatusBadgeProps = {
  status: OrderStatus;
  /** Already translated status name. */
  label: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return <Badge className={cn("border-transparent", tones[status], className)}>{label}</Badge>;
}
