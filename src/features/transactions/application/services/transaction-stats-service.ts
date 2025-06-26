import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { TransactionStats } from "@/domain/entities/transaction";


/**
 * fetches transaction statistics from the API
 * @returns Promise with normalized TransactionStats
 */
export const getTransactionStats = async (): Promise<TransactionStats> => {
  try {
    const response = await httpClient.get<TransactionStats>('/wallets/transactions-stats');
    
    return Promise.resolve(response.data || {
      recharges: 0,
      withdraws: 0,
      in_progress: 0
    });
   
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return Promise.reject(refractHttpError(error));
  }
};
