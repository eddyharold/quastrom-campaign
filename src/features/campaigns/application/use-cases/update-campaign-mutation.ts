import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";
import { UpdateCampaignDto } from "../../domain/dto/update-campaign-dto";

export const useUpdateCampaign = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCampaignDto) => updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY.default });
    },
  });
};
