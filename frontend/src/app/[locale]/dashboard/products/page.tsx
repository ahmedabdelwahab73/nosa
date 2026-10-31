import { Suspense } from "react";
import { ProductsList } from "@/features/catalog/dashboard/products-list";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ProductsPage({ searchParams }: PageProps<"/[locale]/dashboard/products">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <ProductsList searchParams={searchParams} />
    </Suspense>
  );
}
