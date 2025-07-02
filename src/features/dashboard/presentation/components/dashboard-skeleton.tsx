import { Skeleton } from "@/presentation/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`kpi-skeleton-${index}`} className="h-[150px]" />
        ))}
      </div>

      <Skeleton className="h-[180px]" />

      <Skeleton className="h-[300px]" />

      <Skeleton className="h-[300px]" />
    </>
  );
}
