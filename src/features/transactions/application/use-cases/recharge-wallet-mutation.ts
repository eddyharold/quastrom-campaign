import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechargeWallet } from "../services/wallet-service";
import { TRANSACTION_QUERY, WALLET_QUERY } from "@/domain/constants/query";

export const useRechargeWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rechargeWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WALLET_QUERY.getDetails,
      });
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QUERY.getAll,
      });
    },
  });
};
