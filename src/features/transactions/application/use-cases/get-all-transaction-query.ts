import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../services/transaction-service";
import { TRANSACTION_QUERY } from "@/domain/constants/query";

export const useGetTransactionList = () => {
  return useQuery({
    queryKey: TRANSACTION_QUERY.getAll,
    queryFn: async () => await getTransactions(),
  });
};
