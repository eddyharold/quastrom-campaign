import { httpClient } from "@/infrastructure/api/http-client";
import { RechargeWalletDto } from "@/features/transactions/domain/dto/recharge-wallet.dto";
import { refractHttpError } from "@/domain/utils/error";

export const rechargeWallet = async (data: RechargeWalletDto) => {
  try {
    const response = await httpClient.post("/wallets/recharge", data);
    return response.data;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
