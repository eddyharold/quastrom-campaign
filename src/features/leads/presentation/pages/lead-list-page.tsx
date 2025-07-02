import { useEffect } from "react";
import { CheckCircle, CheckCircle2, Loader, MousePointerClick, RefreshCcw, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { LeadDataTable } from "../components/lead-list-data-table";
import { useGetAllLead } from "../../application/use-cases/get-all-lead-query";
import { useGetLeadStats } from "../../application/use-cases/get-lead-stats-query";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/domain/utils/common";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useModal } from "@/presentation/hooks/use-modal";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";
import { useState } from "react";
import { useUpdateLeadStatusBulk } from "../../application/use-cases/update-lead-status-bluk-mutation";
import { AcquireLead } from "@/domain/entities/lead";

export default function LeadListPage() {
  const { updateBreadcrumb } = useLayoutContext();

  const [selectedLeads, setSelectedLeads] = useState<AcquireLead[]>([]);

  const bulkValidation = useModal();
  const bulkRejection = useModal();

  const handleRowSelectionChange = (rows: AcquireLead[]) => {
    setSelectedLeads(rows);
  };

  const {
    data: leads,
    isLoading: isLoadingLeads,
    refetch: refetchLeads,
    isRefetching: isRefetchingLeads,
  } = useGetAllLead();
  const {
    data: leadStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = useGetLeadStats();

  const { mutateAsync: updateLeadStatusBulk, isPending: isUpdating } = useUpdateLeadStatusBulk();

  const handleRefresh = () => {
    refetchLeads();
    refetchStats();
  };

  const handleUpdateLeadStatusBulk = () => {
    updateLeadStatusBulk({ action: "accepted", selectedLeads: selectedLeads.map((lead) => lead.id.toString()) }).then(
      () => {
        setSelectedLeads([]);
        bulkValidation.close();
      }
    );
  };

  const handleUpdateLeadStatusBulkRejection = () => {
    updateLeadStatusBulk({ action: "rejected", selectedLeads: selectedLeads.map((lead) => lead.id.toString()) }).then(
      () => {
        setSelectedLeads([]);
        bulkRejection.close();
      }
    );
  };

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

  return (
    <div className="space-y-6">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        {!isLoadingStats ? (
          <>
            <Card>
              <CardHeader className="flex items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
                <div className="rounded-md bg-info/20 size-8 flex items-center justify-center">
                  <MousePointerClick className="size-4 text-info" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{formatNumber(leadStats?.total || 0)}</div>
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
                <div className="text-3xl font-bold tracking-tight">{formatNumber(leadStats?.pending || 0)}</div>
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
                <div className="text-3xl font-bold tracking-tight">{formatNumber(leadStats?.accepted || 0)}</div>
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
                <div className="text-3xl font-bold tracking-tight">{formatNumber(leadStats?.rejected || 0)}</div>
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-[150px]" />)
        )}
      </div>

      <PageHeader title="Leads" subtitle="Examiner et valider vos prospects de campagne" hideBackButton>
        <Button
          disabled={selectedLeads.filter((lead) => lead.status === "pending").length === 0}
          onClick={bulkValidation.open}
        >
          <CheckCircle2 /> Valider
        </Button>
        <Button
          variant="destructive"
          disabled={selectedLeads.filter((lead) => lead.status === "pending").length === 0}
          onClick={bulkRejection.open}
        >
          <XCircle /> Rejeter
        </Button>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoadingStats || isLoadingLeads || isRefetchingStats || isRefetchingLeads}
        >
          <RefreshCcw className={cn(isRefetchingStats || isRefetchingLeads ? "animate-spin" : "")} />
          Actualiser
        </Button>
      </PageHeader>

      <LeadDataTable
        onRowSelectionChange={handleRowSelectionChange}
        total={leads?.pagination?.total}
        leads={leads?.data || []}
        isLoading={isLoadingLeads}
      />

      <ConfirmDialog
        isLoading={isUpdating}
        isOpen={bulkValidation.isOpen}
        onDismiss={bulkValidation.close}
        onAction={handleUpdateLeadStatusBulk}
        messages={{
          title: "Valider les leads",
          description: `Voulez-vous vraiment valider les ${selectedLeads.length} leads sélectionnés ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, valider",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdating}
        isOpen={bulkRejection.isOpen}
        onDismiss={bulkRejection.close}
        onAction={handleUpdateLeadStatusBulkRejection}
        messages={{
          title: "Rejeter les leads",
          description: `Voulez-vous vraiment rejeter les ${selectedLeads.length} leads sélectionnés ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, rejeter",
          },
        }}
      />
    </div>
  );
}
