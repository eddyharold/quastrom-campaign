import { useQuery } from "@tanstack/react-query";
import { getAllCampaign } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";

export const useGetAllCampaign = () => {
  return useQuery({
    queryKey: CAMPAIGN_QUERY.getAll,
    queryFn: getAllCampaign,
  });
};
