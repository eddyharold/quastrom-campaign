import { httpClient } from "@/infrastructure/api/http-client";
import { refractHttpError } from "@/domain/utils/error";
import { Campaign } from "@/domain/entities/campaign";

/**
 * Recuperation de la liste des campagnes
 * @returns Promise avec la liste des campagnes
 */
export const getcampagn = async (): Promise<Campaign[]> => {
  try {
    const response = await httpClient.get<Campaign[]>(`/campaigns`);
    return Promise.resolve(response.data?? []);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

/**
 * Suppression d'une campagne par ID
 * @param id ID de la campagne a supprimer
 * @returns Promise avec le resultat de la suppression
 */
export const deleteCampaign = async (id: string) => {
  try {
    await httpClient.delete(`/campaigns/${id}`);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
