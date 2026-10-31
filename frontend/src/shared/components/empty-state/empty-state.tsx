import type { ReactNode } from "react";
import { Illustration, type IllustrationName } from "@/shared/components/illustration";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/shared/ui/empty";
import { cn } from "@/shared/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Which brand artwork to show; none keeps it compact (inside tables and panels). */
  illustration?: Extract<IllustrationName, "empty-cart" | "empty-search" | "yarn-happy" | "yarn-basket">;
  /** Button or link to move on ("Add product"). */
  action?: ReactNode;
  className?: string;
};

/** Zero results are a normal state, never an error: friendly artwork, one sentence, one next step. */
export function EmptyState({ title, description, illustration, action, className }: EmptyStateProps) {
  return (
    <Empty className={cn("border py-10", className)}>
      {illustration && <Illustration name={illustration} alt="" className="w-44" />}
      <EmptyHeader>
        <EmptyTitle className="font-display text-lg text-primary-800">{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
