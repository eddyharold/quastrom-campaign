import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { AcquireLead, LeadStats } from "@/domain/entities/lead";

export const getAllLead = async () => {
  try {
    const response = await httpClient.get<AcquireLead[]>(`/my-leads`);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getLeadStats = async (): Promise<LeadStats> => {
  try {
    const response = await httpClient.get<LeadStats>("/my-leads-campaign-stats");

    return Promise.resolve(
      response.data || {
        pending: 0,
        accepted: 0,
        rejected: 0,
        total: 0,
      }
    );
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const updateLeadStatusBulk = async (action: "accepted" | "rejected", selectedLeads: string[]) => {
  try {
    const response = await httpClient.post<{ message: string }>(`/campaigns/lead-validation`, {
      status: action,
      lead_ids: selectedLeads,
    });

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
