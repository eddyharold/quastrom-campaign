import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Pause, Trash } from "lucide-react";
import { useMemo } from "react";
import { Lead } from "@/domain/entities/lead";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatCurrency } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { ActionsDropdown } from "@/presentation/components/data-table/actions-dropdown";
import { DataTable } from "@/presentation/components/data-table/table";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";
import { CampaignDetailsPanel } from "@/presentation/components/lead-details-panel";
import { Campaign } from "@/domain/entities/campaign";
import { LeadStatusBadge } from "@/presentation/components/lead-status-badge";
import { useDeleteLeadMutation } from "../../application/use-cases/delete-lead";
import { toast } from "sonner";

type LeadDataTableProps = {
  leads?: Lead[];
  isLoading: boolean;
};

export const LeadDataTable = ({ leads, isLoading }: LeadDataTableProps) => {
  const viewDetails = useModal<Lead>();
  const viewCampaignDetails = useModal<Campaign>();
  const confirmDelete = useModal<Lead>();
  const { mutate: deleteLead, isPending: isLoadingDeleteLead } = useDeleteLeadMutation();

  const handleDeleteLead = () => {
    if (!confirmDelete.data) return;
    
    deleteLead(confirmDelete.data.id.toString(), {
      onSuccess: () => {
        toast.success(`Le lead ${confirmDelete.data!.name} a été supprimé avec succès`);
        confirmDelete.close();
      },
      onError: (error) => {
        toast.error(`Erreur lors de la suppréssion: ${error.message || 'Une erreur est survenue'}`);
      },
    });
  };

  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        id: "lead",
        header: "Lead",
        cell: ({ row }) => (
          <div className="group space-y-1 cursor-pointer" onClick={() => viewDetails.open(row.original)}>
            <p className="font-medium truncate group-hover:underline group-hover:underline-offset-2 group-hover:text-primary group-hover:decoration-dashed">
              {row.original.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{row.original.email}</span>
              <span>.</span>
              <span>{row.original.company}</span>
            </div>
          </div>
        ),
      },
      {
        id: "campaign",
        header: "Campagne",
        cell: ({ row }) => (
          <div
            className="group space-y-1 cursor-pointer"
            onClick={() => viewCampaignDetails.open(row.original.campaign)}
          >
            <p className="font-medium truncate group-hover:underline group-hover:underline-offset-2 group-hover:text-primary group-hover:decoration-dashed">
              {row.original.campaign.name}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.campaign.name}</p>
          </div>
        ),
      },
      {
        id: "price",
        header: "Prix",
        cell: ({ row: { original: data } }) => formatCurrency(data.price),
        meta: {
          className: "w-[10%]",
        },
      },
      {
        id: "status",
        header: "Statut",
        cell: ({ row: { original: data } }) => <LeadStatusBadge lead={data} />,
        meta: {
          className: "w-[10%]",
        },
      },
      {
        id: "date",
        header: "Date de création",
        cell: ({ row: { original: data } }) => formatDateFromPattern(data.receivedAt, "dd/MM/yyyy - HH:mm:ss"),
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
    [confirmDelete, viewDetails, viewCampaignDetails, deleteLead]
  );

  return (
    <>
      <DataTable<Lead>
        data={leads ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun lead disponible"
      />

      <ConfirmDialog
        isLoading={isLoadingDeleteLead}
        isOpen={confirmDelete.isOpen}
        onDismiss={confirmDelete.close}
        onAction={handleDeleteLead}
        messages={{
          title: "Supprimer le lead ?",
          description: confirmDelete.data ? 
            `Voulez-vous vraiment supprimer le lead "${confirmDelete.data.name}" ? Cette action est irréversible.` : 
            "Voulez-vous vraiment supprimer ce lead ?",
          buttons: {
            cancel: "Annuler",
            action: "Supprimer",
          },
        }}
      />

      <CampaignDetailsPanel
        campaign={viewCampaignDetails.data}
        isOpen={viewCampaignDetails.isOpen}
        onDismiss={viewCampaignDetails.close}
      />
    </>
  );
};
