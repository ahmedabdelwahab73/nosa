import { Suspense } from "react";
import { PagesPage } from "@/features/cms/dashboard/content-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ContentPagesRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <PagesPage />
    </Suspense>
  );
}
