import { useEffect } from "react";
import { Euro, MousePointerClick, Percent, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { Button } from "@/presentation/components/ui/button";
import { Link } from "react-router";
import { PageHeader } from "@/presentation/components/page-header";
import { ALL_CAMPAIGNS } from "@/domain/data/campaign";
import { CampaignDataTable } from "../components/campaign-list-data-table";

export default function DashboardPage() {
  const { updateBreadcrumb } = useLayoutContext();

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

  const totalActiveCampaigns = ALL_CAMPAIGNS.filter((campaign) => campaign.status === "active").length;
  const investments = ALL_CAMPAIGNS.reduce((total, campaign) => total + campaign.budget, 0);
  const alreadySpend = ALL_CAMPAIGNS.reduce((total, campaign) => total + campaign.spent, 0);
  const totalConverted = ALL_CAMPAIGNS.reduce((total, campaign) => total + campaign.conversions, 0);
  const avgConversionRate = Math.round((totalConverted / ALL_CAMPAIGNS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns</CardTitle>
            <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
              <MousePointerClick className="size-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(ALL_CAMPAIGNS.length)}</div>
            <p className="text-sm text-muted-foreground">{totalActiveCampaigns} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investments</CardTitle>
            <div className="rounded-md bg-primary/20 size-8 flex items-center justify-center">
              <Euro className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(investments)}</div>
            <p className="text-sm text-muted-foreground">{formatCurrency(alreadySpend)} dépenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
            <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
              <TrendingUp className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(totalConverted)}</div>
            <p className="text-sm text-muted-foreground">Sur toutes les campagnes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
            <div className="rounded-md bg-accent/20 size-8 flex items-center justify-center">
              <Percent className="size-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(avgConversionRate)}%</div>
            <p className="text-sm text-muted-foreground">Performance globale</p>
          </CardContent>
        </Card>
      </div>

      <PageHeader title="Campagnes" subtitle="Analyser et gerer toutes vos campagnes" hideBackButton>
        <Button asChild>
          <Link to="/campaigns/create">Créer une campagne</Link>
        </Button>
      </PageHeader>

      <CampaignDataTable campaigns={ALL_CAMPAIGNS} isLoading={false} />
    </div>
  );
}
