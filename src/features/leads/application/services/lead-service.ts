import { httpClient } from "@/infrastructure/api/http-client";
import { Lead, LeadStats } from "@/domain/entities/lead";
import { refractHttpError } from "@/domain/utils/error";

export const getAllLead = async () => {
  try {
    const response = await httpClient.get<Lead[]>(`/my-leads`);
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
        validated: 0,
        rejected: 0,
        contacted: 0,
        converted: 0,
        total: 0,
      }
    );
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const updateLeadStatusBulk = async (action: "accepted" | "rejected", selectedLeads: Lead[]) => {
  try {
    const response = await httpClient.post<{ message: string }>(`/campaigns/lead-validation`, {
      status: action,
      lead_ids: selectedLeads.map((lead) => lead.id),
    });

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
