import { useEffect, useMemo } from "react";
import {
  ChevronRight,
  Eye,
  MousePointerClick,
  Pause,
  Percent,
  Play,
  RefreshCcw,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { PerformanceLineChart } from "../components/perfomance-line-chart";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Link } from "react-router";
import { SystemAlert } from "../components/notification-pannel";
import { WalletBalanceCard } from "@/presentation/components/wallet-balance-card";
import { StripeElement } from "@/presentation/components/stripe-element";
import { useGetAllDashboardStats } from "../../application/use-cases/get-dashboard-stats-query";
import { useAuthContext } from "@/presentation/providers/auth-provider";
import { CampaignDetailsPanel } from "@/presentation/components/campaign-details-panel";
import { useModal } from "@/presentation/hooks/use-modal";
import { Campaign } from "@/domain/entities/campaign";
import { cn } from "@/domain/utils/common";
import { useGetRecentNotification } from "@/application/use-cases/get-all-notification-query";
import { Skeleton } from "@/presentation/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { updateBreadcrumb, updateNotificationState } = useLayoutContext();

  const viewCampaignDetails = useModal<Campaign>();

  const {
    data: dashboardStats,
    isLoading: isLoadingDashboardStats,
    isRefetching: isRefetchingDashboardStats,
    refetch: refetchDashboardStats,
  } = useGetAllDashboardStats();
  const {
    data: notifications,
    isLoading: isLoadingNotification,
    isRefetching: isRefetchingNotification,
    refetch: refetchNotification,
  } = useGetRecentNotification();

  const handleRefresh = () => {
    refetchDashboardStats();
    refetchNotification();
  };

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  const performanceData = useMemo(() => {
    if (!dashboardStats) return [];

    // Helper function to format date as MM/YY
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${year}`;
    };

    // Get all unique dates from all three data sources
    const allDates = [
      ...dashboardStats.histogram_data_clicks.map((item) => item.date),
      ...dashboardStats.histogram_data_leads.map((item) => item.date),
      ...dashboardStats.histogram_data_conversions.map((item) => item.date),
    ]
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Create a map for each data type for quick lookup
    const clicksMap = new Map(dashboardStats.histogram_data_clicks.map((item) => [item.date, item.count]));
    const leadsMap = new Map(dashboardStats.histogram_data_leads.map((item) => [item.date, item.count]));
    const conversionsMap = new Map(dashboardStats.histogram_data_conversions.map((item) => [item.date, item.count]));

    // Create the merged data array with formatted dates
    return allDates.map((date) => ({
      date: formatDate(date),
      Clics: clicksMap.get(date) || 0,
      Leads: leadsMap.get(date) || 0,
      Conversions: conversionsMap.get(date) || 0,
    }));
  }, [dashboardStats]);

  const isEmptyHistogram = useMemo(() => {
    if (!dashboardStats) return true;
    return (
      !dashboardStats.histogram_data_clicks.length &&
      !dashboardStats.histogram_data_leads.length &&
      !dashboardStats.histogram_data_conversions.length
    );
  }, [dashboardStats]);

  const isEmptyCampaigns = useMemo(() => {
    if (!dashboardStats) return true;
    return dashboardStats.campaign_recents.length === 0;
  }, [dashboardStats]);

  const isEmptyNotifications = useMemo(() => {
    if (!notifications) return true;
    return notifications.length === 0;
  }, [notifications]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bon retour, {user?.firstname + " " + user?.lastname} !
          </h1>
          <p className="text-muted-foreground text-sm">
            Bienvenue sur votre espace affilié Quastrom. Analysez vos performances et gagnez plus.
          </p>
        </div>

        <div className="flex items-end justify-end">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetchingDashboardStats || isRefetchingNotification}
          >
            <RefreshCcw className={cn(isRefetchingDashboardStats || (isRefetchingNotification && "animate-spin"))} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingDashboardStats ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={`kpi-skeleton-${index}`} className="h-[150px]" />)
        ) : (
          <>
            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clics</CardTitle>
                <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
                  <MousePointerClick className="size-4 text-info" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{formatNumber(dashboardStats?.clicks || 0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
                <div className="rounded-md bg-primary/20 size-8 flex items-center justify-center">
                  <Users className="size-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{formatNumber(dashboardStats?.leads || 0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
                  <TrendingUp className="size-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {formatNumber(dashboardStats?.conversions || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
                <div className="rounded-md bg-accent/20 size-8 flex items-center justify-center">
                  <Percent className="size-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {formatNumber(dashboardStats?.conversion_rate || 0)}%
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <StripeElement>
        <WalletBalanceCard />
      </StripeElement>

      {isLoadingNotification ? (
        <Skeleton className="h-[200px]" />
      ) : (
        !isEmptyNotifications && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notifications récentes</h2>
              <Button
                onClick={() => updateNotificationState(true)}
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Voir plus
                <ChevronRight />
              </Button>
            </div>

            <SystemAlert notifications={notifications || []} />
          </div>
        )
      )}

      {isLoadingDashboardStats ? (
        <Skeleton className="h-[250px]" />
      ) : (
        <Tabs defaultValue="jour">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Performance</h2>

            <TabsList size="sm">
              <TabsTrigger value="jour" className="w-24">
                Jour
              </TabsTrigger>
              <TabsTrigger value="semaine" className="w-24">
                Semaine
              </TabsTrigger>
              <TabsTrigger value="mois" className="w-24">
                Mois
              </TabsTrigger>
            </TabsList>
          </div>

          <Card>
            <CardContent className="pt-6">
              {isEmptyHistogram ? (
                <div className="flex items-center justify-center h-full border border-dashed rounded-md min-h-[200px]">
                  <p className="text-muted-foreground">Aucune statistique disponible</p>
                </div>
              ) : (
                <PerformanceLineChart data={performanceData} categories={["Clics", "Leads", "Conversions"]} />
              )}
            </CardContent>
          </Card>
        </Tabs>
      )}

      {isLoadingDashboardStats ? (
        <Skeleton className="h-[250px]" />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Campagnes récentes</CardTitle>
            </div>
            <Button asChild>
              <Link to="/campaigns/create">Créer une campagne</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isEmptyCampaigns ? (
              <div className="flex items-center justify-center h-full border border-dashed rounded-md min-h-[200px]">
                <p className="text-muted-foreground">Aucune campagne récente</p>
              </div>
            ) : (
              <div className="divide-y">
                {dashboardStats?.campaign_recents.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <span>{campaign.category}</span>
                          <span>•</span>
                          <span>{campaign.total_leads} leads</span>
                          <span>•</span>
                          <span>{campaign.conversion_rate}</span>% conversion rate
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                        </p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(Number(campaign.spent) / Number(campaign.budget)) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button variant="ghost" onClick={() => viewCampaignDetails.open(campaign)}>
                          <Eye />
                        </Button>
                        <Button variant="ghost">{campaign.status !== "paused" ? <Pause /> : <Play />}</Button>
                        <Button variant="ghost" asChild>
                          <Link to={`/campaigns/${campaign.id}/edit`}>
                            <Settings />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <CampaignDetailsPanel
        campaign={viewCampaignDetails.data}
        isOpen={viewCampaignDetails.isOpen}
        onDismiss={viewCampaignDetails.close}
      />
    </div>
  );
}
