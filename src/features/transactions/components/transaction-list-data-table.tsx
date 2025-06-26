import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal, Trash } from "lucide-react";
import { useMemo } from "react";
import { useModal } from "@/presentation/hooks/use-modal";
import { formatCurrency } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { DataTable } from "@/presentation/components/data-table/table";
import { CampaignDetailsPanel } from "@/presentation/components/lead-details-panel";
import { Campaign } from "@/domain/entities/campaign";
import { Transaction } from "@/domain/entities/transaction";
import { TransactionStatusBadge } from "@/presentation/components/transaction-status-badge";
import { Button } from "@/presentation/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { useDeleteTransactionMutation } from "../application/use-cases/delete-transaction";
import { toast } from "sonner";

type TransactionDataTableProps = {
  transactions?: Transaction[];
  isLoading: boolean;
};

export const TransactionDataTable = ({ transactions, isLoading }: TransactionDataTableProps) => {
  const viewCampaignDetails = useModal<Campaign>();
  const confirmDelete = useModal<Transaction>();
  const { mutate: deleteTransaction, isPending: isLoadingDeleteTransaction } = useDeleteTransactionMutation();
  
  const handleDeleteTransaction = () => {
    if (!confirmDelete.data) return;
    
    deleteTransaction(confirmDelete.data.id.toString(), {
      onSuccess: () => {
        // Using non-null assertion since we've already checked confirmDelete.data exists
        toast.success(`La transaction ${confirmDelete.data!.id} a été supprimée avec succès`);
        confirmDelete.close();
      },
      onError: (error) => {
        toast.error(`Erreur lors de la suppression: ${error.message || 'Une erreur est survenue'}`);
      },
    });
  };

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.type === "top_up" ? (
              <ArrowUpRight className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm capitalize">{row.original.type === "top_up" ? "Recharge" : "Paiement"}</span>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Montant",
        cell: ({ row }) => (
          <span className={`font-medium ${row.original.type === "top_up" ? "text-success" : "text-destructive"}`}>
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
        cell: ({ row: { original: data } }) => formatDateFromPattern(data.created_at || data.date, "dd/MM/yyyy - HH:mm:ss"),
        meta: {
          className: "w-[12%]",
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const transaction = row.original;
          
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => confirmDelete.open(transaction)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
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
      
      <Dialog open={confirmDelete.isOpen} onOpenChange={confirmDelete.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={confirmDelete.close}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTransaction}
              disabled={isLoadingDeleteTransaction}
            >
              {isLoadingDeleteTransaction ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
