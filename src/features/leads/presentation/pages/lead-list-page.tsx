import { useEffect } from "react";
import { CheckCircle, Loader, MousePointerClick, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { LeadDataTable } from "../components/lead-list-data-table";
import { useGetLeadList } from "../../application/use-cases/get-lead-list";
import { useGetLeadStats } from "../../application/use-cases/get-lead-stats";

export default function LeadListPage() {
  const { updateBreadcrumb } = useLayoutContext();
  const { data: leads, isLoading } = useGetLeadList();
  const { data: leadStats } = useGetLeadStats();

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
  
  // Extract values from lead stats or calculate from leads if stats not available
  const totalLeads = leadStats?.total || leads?.length || 0;
  const pendingLeads = leadStats?.pending || leads?.filter((lead) => lead.status === "pending").length || 0;
  const convertedLeads = leadStats?.converted || leads?.filter((lead) => lead.status === "converted").length || 0;
  const rejectedLeads = leadStats?.rejected || leads?.filter((lead) => lead.status === "rejected").length || 0;

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
            <div className="text-3xl font-bold tracking-tight">{formatNumber(totalLeads)}</div>
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

      <LeadDataTable leads={leads || []} isLoading={isLoading} />
    </div>
  );
}
