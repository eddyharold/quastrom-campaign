import { useEffect } from "react";
import { Euro, MousePointerClick, Percent, Plus, RefreshCcw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { Button } from "@/presentation/components/ui/button";
import { Link } from "react-router";
import { PageHeader } from "@/presentation/components/page-header";
import { CampaignDataTable } from "../components/campaign-list-data-table";
import { useGetAllCampaign } from "../../application/use-cases/get-all-campaign-query";
import { useGetAllCampaignStats } from "../../application/use-cases/get-all-campaign-stats-query";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { cn } from "@/domain/utils/common";

export default function CampagnList() {
  const { updateBreadcrumb } = useLayoutContext();
  const {
    data: campaigns,
    isLoading,
    refetch: refetchCampaigns,
    isRefetching: isRefetchingCampaigns,
  } = useGetAllCampaign();
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = useGetAllCampaignStats();

  const handleRefresh = () => {
    refetchCampaigns();
    refetchStats();
  };

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        link: "/",
      },
      {
        title: "Campagnes",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  return (
    <div className="space-y-6">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        {!isLoadingStats ? (
          <>
            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns</CardTitle>
                <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
                  <MousePointerClick className="size-4 text-info" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold tracking-tight">{formatNumber(stats?.total_campaign ?? 0)}</div>
                {/* <p className="text-sm text-muted-foreground">{stats?.total_campaign ?? 0} active</p> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Investments</CardTitle>
                <div className="rounded-md bg-primary/20 size-8 flex items-center justify-center">
                  <Euro className="size-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold tracking-tight">{formatCurrency(stats?.total_budget ?? 0)}</div>
                {/* <p className="text-sm text-muted-foreground">{formatCurrency(stats?.total_budget ?? 0)} dépenses</p> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
                  <TrendingUp className="size-4 text-success" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold tracking-tight">{formatNumber(stats?.total_conversion ?? 0)}</div>
                {/* <p className="text-sm text-muted-foreground">Sur toutes les campagnes</p> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
                <div className="rounded-md bg-accent/20 size-8 flex items-center justify-center">
                  <Percent className="size-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold tracking-tight">{formatNumber(stats?.conversion_rate ?? 0)}%</div>
                {/* <p className="text-sm text-muted-foreground">Performance globale</p> */}
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-[150px]" />)
        )}
      </div>

      <PageHeader title="Campagnes" subtitle="Analyser et gerer toutes vos campagnes" hideBackButton>
        <Button asChild>
          <Link to="/campaigns/create">
            <Plus /> Créer une campagne
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoadingStats || isLoading || isRefetchingStats || isRefetchingCampaigns}
        >
          <RefreshCcw className={cn(isRefetchingStats || isRefetchingCampaigns ? "animate-spin" : "")} />
          Actualiser
        </Button>
      </PageHeader>

      <CampaignDataTable campaigns={campaigns?.data} isLoading={isLoading} total={campaigns?.pagination?.total} />
    </div>
  );
}
