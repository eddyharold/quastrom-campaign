import { useQuery } from "@tanstack/react-query";
import { getCampaign } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";

export const useGetCampaign = (id: string) => {
  return useQuery({
    queryKey: CAMPAIGN_QUERY.getById(id),
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
};
