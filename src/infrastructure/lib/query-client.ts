import { ErrorApiResponse } from "@/domain/types/api";
import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount: number, error: unknown) => {
        const apiError = error as AxiosError<ErrorApiResponse>;
        // Don't retry on 4xx errors
        if (apiError.response?.status && apiError.response.status >= 400 && apiError.response.status < 500) {
          return false;
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryOnMount: true,
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
