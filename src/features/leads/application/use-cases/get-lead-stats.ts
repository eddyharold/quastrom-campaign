import { useQuery } from "@tanstack/react-query";
import { getLeadStats, LeadStats } from "../services/lead-stats-service";
import { LEAD_QUERY_KEYS } from "./get-lead-list";

export const useGetLeadStats = () => {
  return useQuery<LeadStats, unknown, LeadStats>({
    queryKey: [...LEAD_QUERY_KEYS.all, 'stats'],
    queryFn: async () => await getLeadStats()
  });
};
