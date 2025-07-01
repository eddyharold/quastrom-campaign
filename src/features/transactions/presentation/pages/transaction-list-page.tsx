import { useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { TransactionDataTable } from "../../components/transaction-list-data-table";
import { useGetTransactionList } from "../../application/use-cases/get-all-transaction-query";
import { useGetTransactionStats } from "../../application/use-cases/get-transaction-stats-query";
import { WalletBalanceCard } from "../../components/wallet-balance-card";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/domain/utils/common";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { StripeElement } from "@/presentation/components/stripe-element";

export default function TransactionListPage() {
  const { updateBreadcrumb } = useLayoutContext();
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isRefetching: isRefetchingTransactions,
    refetch: refetchTransactions,
  } = useGetTransactionList();
  const {
    data: stats,
    isLoading: isLoadingStats,
    isRefetching: isRefetchingStats,
    refetch: refetchStats,
  } = useGetTransactionStats();

  const handleRefresh = () => {
    refetchTransactions();
    refetchStats();
  };

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
      <StripeElement>
        <WalletBalanceCard />
      </StripeElement>

      <div className="grid w-full gap-4 md:grid-cols-3">
        {!isLoadingStats ? (
          <>
            <Card>
              <CardHeader className="flex items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recharges</CardTitle>
                <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
                  <ArrowUpRight className="size-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{formatCurrency(stats?.recharges || 0)}</div>
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
                <div className="text-3xl font-bold tracking-tight">{formatCurrency(stats?.withdraws || 0)}</div>
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
                <div className="text-3xl font-bold tracking-tight">{formatNumber(stats?.in_progress || 0)}</div>
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className="h-[150px]" />)
        )}
      </div>

      <PageHeader title="Transactions" subtitle="Explorer vos recharges et paiements effectués" hideBackButton>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoadingStats || isLoadingTransactions || isRefetchingStats || isRefetchingTransactions}
        >
          <RefreshCcw className={cn(isRefetchingStats || isRefetchingTransactions ? "animate-spin" : "")} />
          Actualiser
        </Button>
      </PageHeader>

      <TransactionDataTable
        total={transactions?.pagination?.total}
        transactions={transactions?.data || []}
        isLoading={isLoadingTransactions}
      />
    </div>
  );
}
