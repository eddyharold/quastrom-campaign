import { useQuery } from "@tanstack/react-query";
import { getAllLead } from "../services/lead-service";
import { LEAD_QUERY } from "@/domain/constants/query";

export const useGetAllLead = () => {
  return useQuery({
    queryKey: LEAD_QUERY.getAll,
    queryFn: getAllLead,
  });
};
