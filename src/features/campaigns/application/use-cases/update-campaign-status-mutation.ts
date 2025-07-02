import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeCampaignStatus } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";
import { CampaignStatus } from "@/domain/entities/campaign";

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: CampaignStatus }) => changeCampaignStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY.default });
    },
  });
};
