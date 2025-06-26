import { Info, Plus, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { formatCurrency } from "@/domain/utils/currency";
import { RechargeWalletModal } from "./recharge-wallet-modal";
import { useGetWallet } from "../application/use-cases/get-wallet";
import { useState } from "react";

interface WalletBalanceCardProps {
  balance: number;
  isActive?: boolean;
  onRechargeClick: () => void;
}

/**
 * A card component that displays wallet balance and status
 */
export const WalletBalanceCard = () => {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  
  const { data: wallet } = useGetWallet();
  

  const walletBalance = wallet?.balance ?? 0;
  const isWalletActive = wallet?.is_active ?? true;

  const handleOpenRechargeModal = () => {
    setIsRechargeModalOpen(true);
  };
  
  const handleCloseRechargeModal = () => {
    setIsRechargeModalOpen(false);
  };
  
  return (
    <> <Card className="border-none bg-gradient-to-r from-primary dark:from-card to-primary/80 dark:to-primary/5 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <CardTitle>Solde du portefeuille</CardTitle>
          </div>
          <Button 
            className="bg-white/80 hover:bg-white/90 text-primary dark:bg-primary/80 dark:hover:bg-primary/90 dark:text-primary-foreground"
            onClick={handleOpenRechargeModal}
          >
            <Plus className="mr-1" />
            Recharger
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
            <Badge 
              variant={isWalletActive ? "success" : "destructive"}
              className="h-6 flex items-center gap-1"
            >
              {isWalletActive ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Actif</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Inactif</span>
                </>
              )}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/80 dark:text-muted-foreground flex items-center gap-1">
              <Info className="text-warning size-3" /> Vous êtes à 20% d'atteindre le seuil minimum
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Recharge Wallet Modal */}
          <RechargeWalletModal 
            isOpen={isRechargeModalOpen} 
            onClose={handleCloseRechargeModal} 
          />
    </>
   
  );
};
