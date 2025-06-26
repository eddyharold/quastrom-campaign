import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCampaign } from "../services/campaigns-service";
import { CAMPAIGN_QUERY_KEYS } from "./get-campagn-list";

/**
 * Mutation pour supprimer une campagne
 * @returns Mutation avec le resultat de la suppression
 */
export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEYS.list() });
    },
  });
};
