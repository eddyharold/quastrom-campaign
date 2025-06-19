import { useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, Info, Loader, Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { PageHeader } from "@/presentation/components/page-header";
import { Button } from "@/presentation/components/ui/button";
import { ALL_TRANSACTIONS } from "@/domain/data/transaction";
import { TransactionDataTable } from "../../components/transaction-list-data-table";

export default function TransactionListPage() {
  const { updateBreadcrumb } = useLayoutContext();

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

  const totalTopUp = ALL_TRANSACTIONS.filter((trx) => trx.status === "success" && trx.type === "top-up").reduce(
    (total, trx) => total + trx.amount,
    0
  );
  const totalPayment = ALL_TRANSACTIONS.filter((trx) => trx.status === "success" && trx.type === "payment").reduce(
    (total, trx) => total + trx.amount,
    0
  );
  const pendingTransactions = ALL_TRANSACTIONS.filter((trx) => trx.status === "pending").length;

  const walletBalance = totalPayment > totalTopUp ? 0 : totalTopUp - totalPayment;

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-r from-primary dark:from-card to-primary/80 dark:to-primary/5 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <CardTitle>Solde du portefeuille</CardTitle>
            </div>
            <Button className="bg-white/80 hover:bg-white/90 text-primary dark:bg-primary/80 dark:hover:bg-primary/90 dark:text-primary-foreground">
              <Plus />
              Recharger
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
            <p className="text-sm text-white/80 dark:text-muted-foreground flex items-center gap-1">
              <Info className="text-warning size-3" /> Vous etes a 20% d'atteindre le seuil minimum de votre
              portefeuille
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid w-full gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recharges</CardTitle>
            <div className="rounded-md bg-success/20 size-8 flex items-center justify-center">
              <ArrowUpRight className="size-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalTopUp)}</div>
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
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalPayment)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions en cours</CardTitle>
            <div className="rounded-md bg-warning/20 size-8 flex items-center justify-center">
              <Loader className="size-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatNumber(pendingTransactions)}</div>
          </CardContent>
        </Card>
      </div>

      <PageHeader
        title="Historique des transactions"
        subtitle="Explorer vos recharges et paiements effectués"
        hideBackButton
      />

      <TransactionDataTable transactions={ALL_TRANSACTIONS} isLoading={false} />
    </div>
  );
}
