import { Suspense } from "react";
import { ProductEditor } from "@/features/catalog/dashboard/product-editor";
import { Skeleton } from "@/shared/ui/skeleton";

export default function NewProductPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-2xl" />}>
      <ProductEditor productId={null} />
    </Suspense>
  );
}
