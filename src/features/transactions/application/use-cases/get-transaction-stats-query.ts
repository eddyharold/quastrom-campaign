import { useQuery } from "@tanstack/react-query";
import { getTransactionStats } from "../services/transaction-service";
import { TransactionStats } from "@/domain/entities/transaction";
import { TRANSACTION_QUERY } from "@/domain/constants/query";

export const useGetTransactionStats = () => {
  return useQuery<TransactionStats, unknown, TransactionStats>({
    queryKey: TRANSACTION_QUERY.getStats,
    queryFn: async () => await getTransactionStats(),
  });
};
