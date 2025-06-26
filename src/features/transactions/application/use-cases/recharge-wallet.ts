import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RechargeWalletDto } from "@/features/transactions/domain/recharge-wallet.dto";
import { rechargeWallet } from "../services/wallet-service";
import { TRANSACTION_QUERY_KEYS } from "./get-transaction-list";

export const useRechargeWalletMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RechargeWalletDto) => rechargeWallet(data),
    onSuccess: () => {
      // Invalidate transaction list and stats to refresh data
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QUERY_KEYS.list(),
      });
      queryClient.invalidateQueries({
        queryKey: [...TRANSACTION_QUERY_KEYS.all, 'stats'],
      });
    },
  });
};
