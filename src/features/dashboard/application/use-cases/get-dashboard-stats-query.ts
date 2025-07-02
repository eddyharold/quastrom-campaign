import { useQuery } from "@tanstack/react-query";
import { getAllDashboardStats } from "../services/dashboard-service";
import { DASHBOARD_QUERY } from "@/domain/constants/query";

export const useGetAllDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY.getAllStats,
    queryFn: getAllDashboardStats,
  });
};
