import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Pause, Trash } from "lucide-react";
import { useMemo } from "react";
import { Campaign } from "@/domain/entities/campaign";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { CampaignStatusBadge } from "@/presentation/components/campaign-status-badge";
import { formatDateFromPattern } from "@/domain/utils/date";
import { ActionsDropdown } from "@/presentation/components/data-table/actions-dropdown";
import { DataTable } from "@/presentation/components/data-table/table";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";
import { CampaignDetailsPanel } from "../../../../presentation/components/campaign-details-panel";
import { useDeleteCampaign } from "../../application/use-cases/delete-campaign-mutation";
import { toast } from "sonner";

type CampaignDataTableProps = {
  campaigns?: Campaign[];
  total?: number;
  isLoading: boolean;
};

export const CampaignDataTable = ({ campaigns, isLoading, total }: CampaignDataTableProps) => {
  const viewDetails = useModal<Campaign>();
  const confirmDelete = useModal<Campaign>();

  const { mutate: deleteCampaign, isPending: isDeletingCampaign } = useDeleteCampaign();

  const handleDeleteCampaign = () => {
    if (!confirmDelete.data) return;

    deleteCampaign(confirmDelete.data.id.toString(), {
      onSuccess: () => {
        toast.success(`Suppression de la campagne`, {
          description: "Campagne supprimée avec succès",
        });
        confirmDelete.close();
      },
    });
  };

  const columns: ColumnDef<Campaign>[] = useMemo(
    () => [
      {
        id: "campaign",
        header: "Campagne",
        cell: ({ row }) => (
          <div className="group space-y-1 cursor-pointer" onClick={() => viewDetails.open(row.original)}>
            <p className="font-medium truncate group-hover:underline group-hover:underline-offset-2 group-hover:text-primary group-hover:decoration-dashed">
              {row.original.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {Number(row.original.conversion_rate).toFixed(2)}% taux de conversion
            </p>
          </div>
        ),
      },
      {
        id: "objective",
        header: "Objective",
        cell: ({ row: { original: data } }) => data.objective.name,
      },
      {
        id: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">
              {formatCurrency(row.original.spent)} / {formatCurrency(row.original.budget)}
            </p>
            <div className="w-20 h-1.5 bg-muted rounded-full">
              <div
                className="h-1.5 bg-blue-500 rounded-full"
                style={{ width: `${(Number(row.original.spent) / Number(row.original.budget)) * 100}%` }}
              />
            </div>
          </div>
        ),
      },
      {
        id: "lead",
        header: "Leads",
        cell: ({ row }) => (
          <div className="border border-dashed p-1.5 text-xs rounded w-fit">
            {formatNumber(row.original.estimated_leads)}
          </div>
        ),
      },
      {
        id: "status",
        header: "Statut",
        cell: ({ row: { original: data } }) => <CampaignStatusBadge campaign={data} />,
        meta: {
          className: "w-[10%]",
        },
      },
      {
        id: "date",
        header: "Date de création",
        cell: ({ row: { original: data } }) => formatDateFromPattern(data.created_at, "dd/MM/yyyy - HH:mm:ss"),
        meta: {
          className: "w-[12%]",
        },
      },
      {
        id: "actions",
        cell: ({ row: { original: data } }) => (
          <ActionsDropdown
            contentClassName="min-w-36"
            items={[
              {
                icon: Eye,
                label: "Voir details",
                onClick: () => viewDetails.open(data),
              },
              {
                icon: Edit,
                label: "Mettre à jour",
                onClick: () => {},
              },
              {
                icon: Pause,
                label: "Mettre en pause",
                onClick: () => {},
              },
              {
                icon: Trash,
                label: "Supprimer",
                onClick: () => confirmDelete.open(data),
              },
            ]}
          />
        ),
        meta: {
          className: "w-[4%]",
        },
      },
    ],
    [confirmDelete, viewDetails]
  );

  return (
    <>
      <DataTable<Campaign>
        data={campaigns ?? []}
        rowCount={total || 0}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune campagne disponible"
      />

      <ConfirmDialog
        isLoading={isDeletingCampaign}
        isOpen={confirmDelete.isOpen}
        onDismiss={confirmDelete.close}
        onAction={handleDeleteCampaign}
        messages={{
          title: "Supprimer la campagne ?",
          description: `Voulez-vous vraiment supprimer la campagne "${confirmDelete.data?.name}" ? Cette action est irréversible.`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, supprimer",
          },
        }}
      />

      <CampaignDetailsPanel campaign={viewDetails.data} isOpen={viewDetails.isOpen} onDismiss={viewDetails.close} />
    </>
  );
};
