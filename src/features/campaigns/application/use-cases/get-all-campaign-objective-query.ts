import { useQuery } from "@tanstack/react-query";
import { getAllCampaignObjective } from "../services/utils-service";
import { COMMON_QUERY } from "@/domain/constants/query";

export const useGetAllCampaignObjective = () => {
  return useQuery({
    queryKey: COMMON_QUERY.getAllObjective,
    queryFn: getAllCampaignObjective,
  });
};
