import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { Campaign, CampaignStats } from "@/domain/entities/campaign";
import { CreateCampaignDto } from "../../domain/dto/create-campaign-dto";

export const getAllCampaign = async () => {
  try {
    const response = await httpClient.get<Campaign[]>(`/campaigns`);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getAllCampaignStats = async (): Promise<CampaignStats | null> => {
  try {
    const response = await httpClient.get<CampaignStats>(`/campaigns-stats`);
    return Promise.resolve(response.data ?? null);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    await httpClient.delete(`/campaigns/${id}`);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const payCampaign = async (data: CreateCampaignDto) => {
  try {
    const response = await httpClient.post<{
      clientSecret: string;
      campaign_id: string;
    }>(`/campaigns/initiate-payment`, { ...data, estimated_leads: 50 });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
