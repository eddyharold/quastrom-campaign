import { httpClient } from "@/infrastructure/api/http-client";
import { Lead } from "@/domain/entities/lead";
import { refractHttpError } from "@/domain/utils/error";

/**
 *  Recuperation de la liste des leads
 * @returns Promise avec la liste des leads
 */
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const response = await httpClient.get<Lead[]>(`/my-leads`);
    
    return Promise.resolve(response.data ?? []);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

/**
 * Suppression d'un lead par ID
 * @param id ID du lead a supprimer
 * @returns Promise avec le resultat de la suppression
 */
export const deleteLead = async (id: string): Promise<void> => {
  try {
    await httpClient.delete(`/my-leads/${id}`);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
