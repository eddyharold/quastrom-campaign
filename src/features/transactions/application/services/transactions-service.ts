import { httpClient } from "@/infrastructure/api/http-client";
import { Transaction } from "@/domain/entities/transaction";
import { refractHttpError } from "@/domain/utils/error";

/**
 * Fetches paginated transactions from the API
 * @returns Promise with paginated transaction data
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await httpClient.get<Transaction[]>(`/wallets/transactions`);
    
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return Promise.reject(refractHttpError(error));
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    await httpClient.delete(`/transactions/${id}`);
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return Promise.reject(refractHttpError(error));
  }
};
