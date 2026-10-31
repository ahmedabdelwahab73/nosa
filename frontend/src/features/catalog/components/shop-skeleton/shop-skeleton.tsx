import { Skeleton } from "@/shared/ui/skeleton";

/** Same layout as the shop screen, so nothing jumps when the real content streams in. */
export function ShopSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-16 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/6] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
