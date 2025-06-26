import { httpClient } from "@/infrastructure/api/http-client";
import { RechargeWalletDto } from "@/features/transactions/domain/recharge-wallet.dto";
import { refractHttpError } from "@/domain/utils/error";

/**
 * Recharge the wallet with the specified amount and payment method
 * @param data RechargeWalletDto containing payment_method and amount
 * @returns Promise with the recharge result
 */
export const rechargeWallet = async (data: RechargeWalletDto): Promise<any> => {
  try {
    const response = await httpClient.post('/wallets/recharge', data);
    return response.data;
  } catch (error) {
    console.error('Error recharging wallet:', error);
    return Promise.reject(refractHttpError(error));
  }
};

export const getWalletBalance = async (): Promise<any> => {
  try {
    const response = await httpClient.get('/wallets');
    return response.data;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return Promise.reject(refractHttpError(error));
  }
};