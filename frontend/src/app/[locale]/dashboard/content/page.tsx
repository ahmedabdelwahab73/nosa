import { Suspense } from "react";
import { ContentPage } from "@/features/cms/dashboard/content-page";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ContentRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <ContentPage />
    </Suspense>
  );
}
