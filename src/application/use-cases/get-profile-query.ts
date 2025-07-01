import { AUTH_QUERY } from "@/domain/constants/query";
import { getProfile } from "@/application/services/auth-service";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = (retriveProfile = false) =>
  useQuery({
    queryKey: AUTH_QUERY.getProfile,
    queryFn: getProfile,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retry: false,
    retryOnMount: false,
    retryDelay: 0,
    enabled: retriveProfile,
  });
