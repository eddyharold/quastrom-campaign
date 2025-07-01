import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, XCircle } from "lucide-react";
import { useMemo } from "react";
import { Lead } from "@/domain/entities/lead";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatCurrency } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { ActionsDropdown } from "@/presentation/components/data-table/actions-dropdown";
import { DataTable } from "@/presentation/components/data-table/table";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";
// import { CampaignDetailsPanel } from "@/presentation/components/lead-details-panel";
import { Campaign } from "@/domain/entities/campaign";
import { LeadStatusBadge } from "@/presentation/components/lead-status-badge";
import { useUpdateLeadStatusBulk } from "../../application/use-cases/update-lead-status-bluk-mutation";

type LeadDataTableProps = {
  leads?: Lead[];
  total?: number;
  isLoading: boolean;
  onSelectLeads?: (leads: Lead[]) => void;
};

export const LeadDataTable = ({ leads, isLoading, total, onSelectLeads }: LeadDataTableProps) => {
  const viewDetails = useModal<Lead>();
  const viewCampaignDetails = useModal<Campaign>();
  const validateLead = useModal<Lead>();
  const rejectLead = useModal<Lead>();

  const { mutateAsync: updateLeadStatusBulk, isPending: isUpdating } = useUpdateLeadStatusBulk();

  const handleValidateLead = () => {
    if (!validateLead.data) return;
    updateLeadStatusBulk({ action: "accepted", selectedLeads: [validateLead.data] }).then(() => {
      validateLead.close();
    });
  };

  const handleRejectLead = () => {
    if (!rejectLead.data) return;
    updateLeadStatusBulk({ action: "rejected", selectedLeads: [rejectLead.data] }).then(() => {
      rejectLead.close();
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
                icon: Check,
                label: "Valider",
                onClick: () => validateLead.open(data),
              },
              {
                icon: XCircle,
                label: "Rejeter",
                onClick: () => rejectLead.open(data),
              },
            ]}
          />
        ),
        meta: {
          className: "w-[4%]",
        },
      },
    ],
    [viewDetails, viewCampaignDetails, validateLead, rejectLead]
  );

  return (
    <>
      <DataTable<Lead>
        data={leads ?? []}
        rowCount={total}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun lead disponible"
        onRowSelectionChange={onSelectLeads}
      />

      <ConfirmDialog
        isLoading={isUpdating}
        isOpen={validateLead.isOpen}
        onDismiss={validateLead.close}
        onAction={handleValidateLead}
        messages={{
          title: "Valider le lead",
          description: `Voulez-vous vraiment valider le lead "${validateLead.data?.name}" ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, valider",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdating}
        isOpen={rejectLead.isOpen}
        onDismiss={rejectLead.close}
        onAction={handleRejectLead}
        messages={{
          title: "Rejeter le lead",
          description: `Voulez-vous vraiment rejeter le lead "${rejectLead.data?.name}" ? Cette action est irréversible`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, rejeter",
          },
        }}
      />

      {/* <CampaignDetailsPanel
        campaign={viewCampaignDetails.data}
        isOpen={viewCampaignDetails.isOpen}
        onDismiss={viewCampaignDetails.close}
      /> */}
    </>
  );
};
