import { Plus, Wallet, CheckCircle2, AlertTriangle, RefreshCcw } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { formatCurrency } from "@/domain/utils/currency";
import { RechargeWalletModal } from "./recharge-wallet-modal";
import { useState } from "react";
import { useGetWallet } from "@/application/use-cases/get-wallet-query";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { cn } from "@/domain/utils/common";

export const WalletBalanceCard = () => {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  const {
    data: wallet,
    isLoading: isLoadingWallet,
    refetch: refetchWallet,
    isRefetching: isRefetchingWallet,
  } = useGetWallet();

  const walletBalance = wallet?.balance ?? 0;
  const isWalletActive = wallet?.is_active ?? true;

  const handleOpenRechargeModal = () => {
    setIsRechargeModalOpen(true);
  };

  const handleCloseRechargeModal = () => {
    setIsRechargeModalOpen(false);
  };

  return (
    <>
      <Card className="border-none bg-gradient-to-r from-primary dark:from-card to-primary/80 dark:to-primary/5 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <CardTitle>
                <div className="flex items-center gap-2">
                  Portefeuille
                  <Badge
                    variant={isWalletActive ? "success" : "destructive"}
                    className="h-6 px-1.5 flex items-center gap-1"
                  >
                    {isWalletActive ? (
                      <>
                        <CheckCircle2 className="size-3" />
                        <span>Actif</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="size-3" />
                        <span>Inactif</span>
                      </>
                    )}
                  </Badge>
                </div>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleOpenRechargeModal}>
                <Plus />
                Recharger
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetchWallet()}
                disabled={isLoadingWallet || isRefetchingWallet}
              >
                <RefreshCcw className={cn(isRefetchingWallet ? "animate-spin" : "")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingWallet ? (
            <Skeleton className="h-8 lg:w-60" />
          ) : (
            <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
          )}
        </CardContent>
      </Card>

      <RechargeWalletModal isOpen={isRechargeModalOpen} onClose={handleCloseRechargeModal} />
    </>
  );
};
