import { useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { TransactionDataTable } from "../../components/transaction-list-data-table";
import { useGetTransactionList } from "../../application/use-cases/get-transaction-list";
import { useGetTransactionStats } from "../../application/use-cases/get-transaction-stats";
import { WalletBalanceCard } from "../../components/wallet-balance-card";

export default function TransactionListPage() {
  const { updateBreadcrumb } = useLayoutContext();
  const { data: transactions, isLoading } = useGetTransactionList();
  const { data: transactionStats } = useGetTransactionStats();

  
  const recharges = transactionStats?.recharges || 0;
  const withdraws = transactionStats?.withdraws || 0;
  const inProgress = transactionStats?.in_progress || 0;
  

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        link: "/",
      },
      {
        title: "Transactions",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  return (
    <div className="space-y-6">
      <WalletBalanceCard />

      <div className="grid w-full gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recharges</CardTitle>
            <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
              <ArrowUpRight className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(recharges)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paiements</CardTitle>
            <div className="rounded-md bg-destructive/20 size-8 flex items-center justify-center">
              <ArrowDownRight className="size-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(withdraws)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions en cours</CardTitle>
            <div className="rounded-md bg-warning/20 size-8 flex items-center justify-center">
              <Loader2 className="size-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(inProgress)}</div>
          </CardContent>
        </Card>
      </div>

      <PageHeader
        title="Historique des transactions"
        subtitle="Explorer vos recharges et paiements effectués"
        hideBackButton
      />

      <TransactionDataTable transactions={transactions || []} isLoading={isLoading} />

    </div>
  );
}
