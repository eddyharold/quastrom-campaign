import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCampaign } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY.default });
    },
  });
};
