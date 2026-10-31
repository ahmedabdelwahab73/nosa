import { Suspense } from "react";
import { ProductEditor } from "@/features/catalog/dashboard/product-editor";
import { Skeleton } from "@/shared/ui/skeleton";

async function EditProduct({ params }: Pick<PageProps<"/[locale]/dashboard/products/[id]">, "params">) {
  const { id } = await params;
  return <ProductEditor productId={id} />;
}

export default function EditProductPage({ params }: PageProps<"/[locale]/dashboard/products/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-2xl" />}>
      <EditProduct params={params} />
    </Suspense>
  );
}
