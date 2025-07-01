import { useQuery } from "@tanstack/react-query";
import { getAllCampaignStats } from "../services/campaign-service";
import { CAMPAIGN_QUERY } from "@/domain/constants/query";

export const useGetAllCampaignStats = () => {
  return useQuery({
    queryKey: CAMPAIGN_QUERY.getAllStats,
    queryFn: getAllCampaignStats,
  });
};
