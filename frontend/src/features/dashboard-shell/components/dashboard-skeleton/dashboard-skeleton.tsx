import { Skeleton } from "@/shared/ui/skeleton";

/** Same frame proportions as the real dashboard, so nothing jumps when it loads. */
export function DashboardSkeleton() {
  return (
    <div className="flex min-h-dvh">
      <Skeleton className="hidden w-64 shrink-0 rounded-none bg-primary-600/20 md:block" />
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Skeleton className="ms-auto h-10 w-40 rounded-full" />
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
