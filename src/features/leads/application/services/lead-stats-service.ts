import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";

/**
 * Interface for lead statistics
 */
export interface LeadStats {
  pending: number;
  validated: number;
  rejected: number;
  contacted: number;
  converted: number;
  total: number;
}

/**
 * Fetches lead statistics from the API
 * @returns Promise with normalized LeadStats
 */
export const getLeadStats = async (): Promise<LeadStats> => {
  try {
    const response = await httpClient.get<LeadStats>('/my-leads-campaign-stats');
    
    return Promise.resolve(response.data || {
      pending: 0,
      validated: 0,
      rejected: 0,
      contacted: 0,
      converted: 0,
      total: 0 
    });
   
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
