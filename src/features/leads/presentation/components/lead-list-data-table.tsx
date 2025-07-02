import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, XCircle } from "lucide-react";
import { useMemo } from "react";
import { AcquireLead } from "@/domain/entities/lead";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatDateFromPattern } from "@/domain/utils/date";
import { ActionsDropdown } from "@/presentation/components/data-table/actions-dropdown";
import { DataTable } from "@/presentation/components/data-table/table";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";
import { LeadStatusBadge } from "@/presentation/components/lead-status-badge";
import { useUpdateLeadStatusBulk } from "../../application/use-cases/update-lead-status-bluk-mutation";
import { buildFullName } from "@/domain/utils/common";
import { LeadDetailsPanel } from "@/presentation/components/lead-details-panel";
// import { CampaignDetailsPanel } from "@/presentation/components/campaign-details-panel";

type LeadDataTableProps = {
  leads?: AcquireLead[];
  total?: number;
  isLoading: boolean;
  onRowSelectionChange?: (leads: AcquireLead[]) => void;
};

export const LeadDataTable = ({ leads, isLoading, total, onRowSelectionChange }: LeadDataTableProps) => {
  const viewDetails = useModal<AcquireLead>();
  const validateLead = useModal<AcquireLead>();
  const rejectLead = useModal<AcquireLead>();

  const { mutateAsync: updateLeadStatusBulk, isPending: isUpdating } = useUpdateLeadStatusBulk();

  const handleValidateLead = () => {
    if (!validateLead.data) return;
    updateLeadStatusBulk({ action: "accepted", selectedLeads: [validateLead.data.id.toString()] }).then(() => {
      validateLead.close();
    });
  };

  const handleRejectLead = () => {
    if (!rejectLead.data) return;
    updateLeadStatusBulk({ action: "rejected", selectedLeads: [rejectLead.data.id.toString()] }).then(() => {
      rejectLead.close();
    });
  };

  const columns: ColumnDef<AcquireLead>[] = useMemo(
    () => [
      {
        id: "lead",
        header: "Lead",
        cell: ({ row }) => (
          <div
            onClick={() => viewDetails.open(row.original)}
            className="font-medium cursor-pointer truncate hover:underline hover:underline-offset-2 hover:text-primary hover:decoration-dashed"
          >
            {row.original.code}
          </div>
        ),
        meta: {
          className: "w-[12%]",
        },
      },
      {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium truncate">
              {buildFullName(row.original.lead.firstname, row.original.lead.lastname, "-")}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {row.original.lead.email && <span>{row.original.lead.email}</span>}
              {row.original.lead.phone && <span>.</span>}
              {row.original.lead.phone && <span>{row.original.lead.phone}</span>}
            </div>
          </div>
        ),
      },
      {
        id: "campaign",
        header: "Campagne",
        cell: ({ row }) => row.original.campaign.name,
      },
      // {
      //   id: "price",
      //   header: "Prix",
      //   cell: ({ row: { original: data } }) => formatCurrency(data.lead.price),
      //   meta: {
      //     className: "w-[10%]",
      //   },
      // },
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
              ...(data.status === "pending"
                ? [
                    {
                      icon: CheckCircle2,
                      label: "Valider",
                      onClick: () => validateLead.open(data),
                    },
                    {
                      icon: XCircle,
                      label: "Rejeter",
                      onClick: () => rejectLead.open(data),
                    },
                  ]
                : []),
            ]}
          />
        ),
        meta: {
          className: "w-[4%]",
        },
      },
    ],
    [viewDetails, validateLead, rejectLead]
  );

  return (
    <>
      <DataTable<AcquireLead>
        data={leads ?? []}
        rowCount={total}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun lead disponible"
        onRowSelectionChange={onRowSelectionChange}
        selectionCondition={(row) => row.status === "pending"}
      />

      <ConfirmDialog
        isLoading={isUpdating}
        isOpen={validateLead.isOpen}
        onDismiss={validateLead.close}
        onAction={handleValidateLead}
        messages={{
          title: "Valider le lead",
          description: `Voulez-vous vraiment valider le lead "${validateLead.data?.code}" ?`,
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
          description: `Voulez-vous vraiment rejeter le lead "${rejectLead.data?.code}" ? Cette action est irréversible`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, rejeter",
          },
        }}
      />

      <LeadDetailsPanel lead={viewDetails.data} isOpen={viewDetails.isOpen} onDismiss={viewDetails.close} />
    </>
  );
};
