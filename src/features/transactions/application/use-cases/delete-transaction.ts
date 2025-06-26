import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "../services/transactions-service";
import { TRANSACTION_QUERY_KEYS } from "./get-transaction-list";

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QUERY_KEYS.list(),
      });
    },
  });
};
