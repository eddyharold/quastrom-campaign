import { useQuery } from "@tanstack/react-query";
import { getTransactionStats } from "../services/transaction-stats-service";
import { TransactionStats } from "@/domain/entities/transaction";

export const TRANSACTION_STATS_QUERY_KEYS = {
  all: ['transaction-stats'] as const,
  stats: () => [...TRANSACTION_STATS_QUERY_KEYS.all, 'stats'] as const,
};

export const useGetTransactionStats = () => {
  return useQuery<TransactionStats, unknown, TransactionStats>({
    queryKey: TRANSACTION_STATS_QUERY_KEYS.stats(),
    queryFn: async () => await getTransactionStats()
  });
};
