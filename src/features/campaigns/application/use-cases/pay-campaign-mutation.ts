import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payCampaign } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";

export const usePayCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY.default });
    },
  });
};
