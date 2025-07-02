import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechargeWallet } from "../services/wallet-service";
import { WALLET_QUERY } from "@/domain/constants/query";

export const useRechargeWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rechargeWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY.default });
    },
  });
};
