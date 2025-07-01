import { useQuery } from "@tanstack/react-query";
import { getLeadStats } from "../services/lead-service";
import { LEAD_QUERY } from "@/domain/constants/query";

export const useGetLeadStats = () => {
  return useQuery({
    queryKey: LEAD_QUERY.getStats,
    queryFn: getLeadStats,
  });
};
