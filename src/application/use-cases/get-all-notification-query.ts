import { useQuery } from "@tanstack/react-query";
import { getAllNotification, getRecentNotification } from "../services/notification-service";
import { NOTIFICATION_QUERY } from "@/domain/constants/query";

export const useGetAllNotification = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY.getAll,
    queryFn: getAllNotification,
  });
};

export const useGetRecentNotification = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY.getRecent,
    queryFn: getRecentNotification,
  });
};
