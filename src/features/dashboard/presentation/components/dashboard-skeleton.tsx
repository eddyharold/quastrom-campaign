import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useAuthContext } from "@/presentation/providers/auth-provider";

export function DashboardSkeleton() {
  const { user } = useAuthContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bon retour, {user?.firstname + " " + user?.lastname} !
        </h1>
        <p className="text-muted-foreground text-sm">Visualisez les performances des auto-écoles en temps réel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={`kpi-skeleton-${index}`} className="h-[150px]" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton key={`kpi-skeleton-lead-overview`} className="col-span-4 h-[250px]" />

        <Skeleton key={`kpi-skeleton-lead-status-shares`} className="col-span-3 h-[250px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton key={`kpi-skeleton-lead-sales-evolution`} className="h-[250px]" />
        <Skeleton key={`kpi-skeleton-lead-conversion-evolution`} className="h-[250px]" />
      </div>
    </div>
  );
}
