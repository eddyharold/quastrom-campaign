import { useQuery } from "@tanstack/react-query";
import { getWalletBalance } from "../services/wallet-service";
import { Wallet } from "@/domain/entities/wallet";

export const WALLET_QUERY_KEYS = {
  all: ["wallet"] as const,
  details: () => [...WALLET_QUERY_KEYS.all, "details"] as const,
};

/**
 * Hook to fetch wallet details
 * @returns Query result with wallet data
 */
export const useGetWallet = () => {
  return useQuery<Wallet>({
    queryKey: WALLET_QUERY_KEYS.details(),
    queryFn: getWalletBalance,
  });
};
