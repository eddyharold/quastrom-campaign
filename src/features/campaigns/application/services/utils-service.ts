import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { Creative, Objective } from "@/domain/entities/common";

export const getAllCampaignObjective = async () => {
  try {
    const response = await httpClient.get<Objective[]>(`/campaign-objectives-list`);
    return Promise.resolve(response.data ?? []);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getAllCreative = async (): Promise<Creative[]> => {
  try {
    const response = await httpClient.get<Creative[]>(`/campaign-creatives`);
    return Promise.resolve(response.data ?? []);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
