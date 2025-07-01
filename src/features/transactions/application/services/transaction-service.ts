import { httpClient } from "@/infrastructure/api/http-client";
import { Transaction, TransactionStats } from "@/domain/entities/transaction";
import { refractHttpError } from "@/domain/utils/error";

export const getTransactionStats = async (): Promise<TransactionStats> => {
  try {
    const response = await httpClient.get<TransactionStats>("/wallets/transactions-stats");

    return Promise.resolve(
      response.data || {
        recharges: 0,
        withdraws: 0,
        in_progress: 0,
      }
    );
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getTransactions = async () => {
  try {
    const response = await httpClient.get<Transaction[]>(`/wallets/transactions`);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    await httpClient.delete(`/transactions/${id}`);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
