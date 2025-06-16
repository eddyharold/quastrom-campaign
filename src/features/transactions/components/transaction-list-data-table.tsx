import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatCurrency } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { DataTable } from "@/presentation/components/data-table/table";
import { CampaignDetailsPanel } from "@/presentation/components/lead-details-panel";
import { Campaign } from "@/domain/entities/campaign";
import { Transaction } from "@/domain/entities/transaction";
import { TransactionStatusBadge } from "@/presentation/components/transaction-status-badge";

type TransactionDataTableProps = {
  transactions?: Transaction[];
  isLoading: boolean;
};

export const TransactionDataTable = ({ transactions, isLoading }: TransactionDataTableProps) => {
  const viewCampaignDetails = useModal<Campaign>();

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.type === "top-up" ? (
              <ArrowUpRight className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm capitalize">{row.original.type === "top-up" ? "Recharge" : "Paiement"}</span>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Montant",
        cell: ({ row }) => (
          <span className={`font-medium ${row.original.type === "top-up" ? "text-success" : "text-destructive"}`}>
            {formatCurrency(row.original.amount)}
          </span>
        ),
      },
      {
        id: "campaign",
        header: "Campagne",
        cell: ({ row }) =>
          row.original.campaign ? (
            <div
              className="group space-y-1 cursor-pointer"
              onClick={() => viewCampaignDetails.open(row.original.campaign)}
            >
              <p className="font-medium truncate group-hover:underline group-hover:underline-offset-2 group-hover:text-primary group-hover:decoration-dashed">
                {row.original.campaign.name}
              </p>
              <p className="text-xs text-muted-foreground">{row.original.campaign.name}</p>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
        meta: {
          className: "w-[20%]",
        },
      },
      
      {
        id: "status",
        header: "Statut",
        cell: ({ row: { original: data } }) => <TransactionStatusBadge transaction={data} />,
        meta: {
          className: "w-[10%]",
        },
      },
      {
        id: "date",
        header: "Date de création",
        cell: ({ row: { original: data } }) => formatDateFromPattern(data.date, "dd/MM/yyyy - HH:mm:ss"),
        meta: {
          className: "w-[12%]",
        },
      },
    ],
    [viewCampaignDetails]
  );

  return (
    <>
      <DataTable<Transaction>
        data={transactions ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune transaction disponible"
      />

      <CampaignDetailsPanel
        campaign={viewCampaignDetails.data}
        isOpen={viewCampaignDetails.isOpen}
        onDismiss={viewCampaignDetails.close}
      />
    </>
  );
};
