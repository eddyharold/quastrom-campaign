import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { DashboardStats } from "@/domain/entities/dashboard";

export const getAllDashboardStats = async () => {
  try {
    const response = await httpClient.get<DashboardStats>(`/advertiser/dashboard`);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
