import { useQuery } from "@tanstack/react-query";
import { getWalletBalance } from "../services/wallet-service";
import { WALLET_QUERY } from "@/domain/constants/query";

export const useGetWallet = () => {
  return useQuery({
    queryKey: WALLET_QUERY.getDetails,
    queryFn: getWalletBalance,
  });
};
