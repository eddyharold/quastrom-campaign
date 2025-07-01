import { useQuery } from "@tanstack/react-query";
import { getAllCreative } from "../services/utils-service";
import { COMMON_QUERY } from "@/domain/constants/query";

export const useGetAllCreative = () => {
  return useQuery({
    queryKey: COMMON_QUERY.getAllCreative,
    queryFn: getAllCreative,
  });
};
