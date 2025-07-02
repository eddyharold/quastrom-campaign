import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Loader2, Pause, Play, RefreshCcw, StopCircle, Trash } from "lucide-react";
import { useMemo } from "react";
import { Campaign, CampaignStatus } from "@/domain/entities/campaign";
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
import { useUpdateCampaignStatus } from "../../application/use-cases/update-campaign-status-mutation";
import { useNavigate } from "react-router";

type CampaignDataTableProps = {
  campaigns?: Campaign[];
  total?: number;
  isLoading: boolean;
};

export const CampaignDataTable = ({ campaigns, isLoading, total }: CampaignDataTableProps) => {
  const navigate = useNavigate();

  const viewDetails = useModal<Campaign>();
  const confirmDelete = useModal<Campaign>();
  const confirmStandBy = useModal<Campaign>();
  const confirmStart = useModal<Campaign>();
  const confirmEnd = useModal<Campaign>();
  const confirmPause = useModal<Campaign>();
  const confirmResume = useModal<Campaign>();
  const confirmRestart = useModal<Campaign>();

  const { mutate: deleteCampaign, isPending: isDeletingCampaign } = useDeleteCampaign();

  const { mutate: updateCampaignStatus, isPending: isUpdatingCampaignStatus } = useUpdateCampaignStatus();

  const handleDeleteCampaign = () => {
    if (!confirmDelete.data) return;

    deleteCampaign(confirmDelete.data.id.toString(), {
      onSuccess: () => {
        toast.success(`Suppression`, {
          description: "Campagne supprimée avec succès",
        });
        confirmDelete.close();
      },
    });
  };

  const handleCampaignStatusChange = (status: CampaignStatus, data?: Campaign | null) => {
    if (!data) return;

    updateCampaignStatus(
      {
        id: data.id.toString(),
        status,
      },
      {
        onSuccess: () => {
          toast.success(`Changement de statut`, {
            description: "Statut de la campagne mise à jour avec succès",
          });
          confirmEnd.close();
          confirmPause.close();
          confirmResume.close();
          confirmRestart.close();
          confirmStandBy.close();
          confirmStart.close();
        },
      }
    );
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
        id: "category",
        header: "Secteur d'application",
        cell: ({ row: { original: data } }) => data.category || "-",
        meta: {
          className: "w-[15%]",
        },
      },
      {
        id: "objective",
        header: "Objective",
        cell: ({ row: { original: data } }) => data.objective.name,
        meta: {
          className: "w-[15%]",
        },
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
        meta: {
          className: "w-[15%]",
        },
      },
      {
        id: "lead",
        header: "Leads",
        cell: ({ row }) => (
          <div className="border border-dashed p-1.5 text-xs rounded w-fit">
            {formatNumber(row.original.estimated_leads)}
          </div>
        ),
        meta: {
          className: "w-[5%]",
        },
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
              ...(data.status !== "paused" && data.status !== "ended"
                ? [
                    {
                      icon: Edit,
                      label: "Mettre à jour",
                      onClick: () => navigate(`/campaigns/${data.id}/edit`),
                    },
                  ]
                : []),
              ...(data.status !== "draft" && data.status !== "ended"
                ? [
                    {
                      icon: Loader2,
                      label: "Revenir en stand by",
                      onClick: () => confirmStandBy.open(data),
                    },
                  ]
                : []),
              ...(data.status === "draft"
                ? [
                    {
                      icon: Play,
                      label: "Commencer",
                      onClick: () => confirmStart.open(data),
                    },
                  ]
                : []),
              ...(data.status === "active"
                ? [
                    {
                      icon: Pause,
                      label: "Mettre en pause",
                      onClick: () => confirmPause.open(data),
                    },
                  ]
                : []),
              ...(data.status === "paused"
                ? [
                    {
                      icon: Play,
                      label: "Reprendre",
                      onClick: () => confirmResume.open(data),
                    },
                  ]
                : []),
              ...(data.status === "ended"
                ? [
                    {
                      icon: RefreshCcw,
                      label: "Relancer",
                      onClick: () => confirmRestart.open(data),
                    },
                  ]
                : []),
              ...(data.status === "active" || data.status === "paused"
                ? [
                    {
                      icon: StopCircle,
                      label: "Terminer maintenant",
                      onClick: () => confirmEnd.open(data),
                    },
                  ]
                : []),
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
    [
      confirmDelete,
      viewDetails,
      confirmPause,
      confirmResume,
      confirmRestart,
      confirmEnd,
      confirmStandBy,
      confirmStart,
      navigate,
    ]
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

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmEnd.isOpen}
        onDismiss={confirmEnd.close}
        onAction={() => handleCampaignStatusChange("ended", confirmEnd.data)}
        messages={{
          title: "Terminer la campagne ?",
          description: `Voulez-vous vraiment terminer la campagne "${confirmEnd.data?.name}" ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, terminer",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmPause.isOpen}
        onDismiss={confirmPause.close}
        onAction={() => handleCampaignStatusChange("paused", confirmPause.data)}
        messages={{
          title: "Mettre en pause la campagne ?",
          description: `Voulez-vous vraiment mettre la campagne "${confirmPause.data?.name}" en pause ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, mettre en pause",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmResume.isOpen}
        onDismiss={confirmResume.close}
        onAction={() => handleCampaignStatusChange("active", confirmResume.data)}
        messages={{
          title: "Reprendre la campagne ?",
          description: `Voulez-vous vraiment reprendre la campagne "${confirmResume.data?.name}" ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, reprendre",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmRestart.isOpen}
        onDismiss={confirmRestart.close}
        onAction={() => handleCampaignStatusChange("active", confirmRestart.data)}
        messages={{
          title: "Relancer la campagne ?",
          description: `Voulez-vous vraiment relancer la campagne "${confirmRestart.data?.name}" ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, relancer",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmStandBy.isOpen}
        onDismiss={confirmStandBy.close}
        onAction={() => handleCampaignStatusChange("draft", confirmStandBy.data)}
        messages={{
          title: "Revenir en stand by ?",
          description: `Voulez-vous vraiment remettre la campagne "${confirmStandBy.data?.name}" en stand by ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, revenir en stand by",
          },
        }}
      />

      <ConfirmDialog
        isLoading={isUpdatingCampaignStatus}
        isOpen={confirmStart.isOpen}
        onDismiss={confirmStart.close}
        onAction={() => handleCampaignStatusChange("active", confirmStart.data)}
        messages={{
          title: "Commencer la campagne ?",
          description: `Voulez-vous vraiment commencer la campagne "${confirmStart.data?.name}" ?`,
          buttons: {
            cancel: "Non, annuler",
            action: "Oui, commencer",
          },
        }}
      />

      <CampaignDetailsPanel campaign={viewDetails.data} isOpen={viewDetails.isOpen} onDismiss={viewDetails.close} />
    </>
  );
};
