import { Suspense } from "react";
import { CategoriesManager } from "@/features/catalog/dashboard/categories-manager";
import { Skeleton } from "@/shared/ui/skeleton";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <CategoriesManager />
    </Suspense>
  );
}
