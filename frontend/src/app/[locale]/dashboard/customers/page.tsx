import { Suspense } from "react";
import { CustomersList } from "@/features/customers/dashboard/customers-list";
import { Skeleton } from "@/shared/ui/skeleton";

export default function CustomersPage({ searchParams }: PageProps<"/[locale]/dashboard/customers">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <CustomersList searchParams={searchParams} />
    </Suspense>
  );
}
