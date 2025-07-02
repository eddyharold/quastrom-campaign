import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { Wallet } from "@/domain/entities/wallet";

export const getWalletBalance = async () => {
  try {
    const response = await httpClient.get<Wallet>("/wallets");
    return response.data;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const rechargeWallet = async (amount: number) => {
  try {
    const response = await httpClient.post<{ clientSecret: string }>("/wallets/recharge", { amount });
    return response.data?.clientSecret;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
