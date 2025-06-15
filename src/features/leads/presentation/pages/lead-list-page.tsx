import { useEffect } from "react";
import { CheckCircle, Loader, MousePointerClick, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { LeadDataTable } from "../components/lead-list-data-table";
import { ALL_LEADS } from "@/domain/data/lead";

export default function LeadListPage() {
  const { updateBreadcrumb } = useLayoutContext();

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        link: "/",
      },
      {
        title: "Leads",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  const pendingLeads = ALL_LEADS.filter((lead) => lead.status === "pending").length;
  const convertedLeads = ALL_LEADS.filter((lead) => lead.status === "converted").length;
  const rejectedLeads = ALL_LEADS.filter((lead) => lead.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
            <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
              <MousePointerClick className="size-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(ALL_LEADS.length)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            <div className="rounded-md bg-warning/20 size-8 flex items-center justify-center">
              <Loader className="size-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(pendingLeads)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Convertis</CardTitle>
            <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
              <CheckCircle className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(convertedLeads)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
            <div className="rounded-md bg-destructive/20 size-8 flex items-center justify-center">
              <XCircle className="size-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(rejectedLeads)}</div>
          </CardContent>
        </Card>
      </div>

      <PageHeader title="Leads" subtitle="Examiner et valider vos prospects de campagne" hideBackButton />

      <LeadDataTable leads={ALL_LEADS} isLoading={false} />
    </div>
  );
}
