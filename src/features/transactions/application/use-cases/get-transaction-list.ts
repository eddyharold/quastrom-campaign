import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/domain/entities/transaction";
import { getTransactions } from "../services/transactions-service";

export const TRANSACTION_QUERY_KEYS = {
  all: ['transactions'] as const,
  list: () => [...TRANSACTION_QUERY_KEYS.all, 'list'] as const,
};

export const useGetTransactionList = () => {
  return useQuery<Transaction[], unknown, Transaction[]>({
    queryKey: TRANSACTION_QUERY_KEYS.list(),
    queryFn: async () => await getTransactions()
  });
};

export const useTransactionStatistics = (transactions: Transaction[] | undefined) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalTopUp: 0,
      totalPayment: 0,
      pendingTransactions: 0,
      walletBalance: 0,
    };
  }

  const totalTopUp = transactions
    .filter((trx) => trx.status === "success" && trx.type === "top_up")
    .reduce((total, trx) => total + parseFloat(trx.amount), 0);
    
  const totalPayment = transactions
    .filter((trx) => trx.status === "success" && trx.type === "payment")
    .reduce((total, trx) => total + parseFloat(trx.amount), 0);
    
  const pendingTransactions = transactions
    .filter((trx) => trx.status === "pending")
    .length;

  const walletBalance = totalPayment > totalTopUp ? 0 : totalTopUp - totalPayment;

  return {
    totalTopUp,
    totalPayment,
    pendingTransactions,
    walletBalance,
  };
};
