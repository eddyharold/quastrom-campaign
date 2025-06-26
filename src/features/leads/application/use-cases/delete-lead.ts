import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLead } from "../services/leads-service";
import { LEAD_QUERY_KEYS } from "./get-lead-list";

export const useDeleteLeadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LEAD_QUERY_KEYS.list(),
      });
    },
  });
};
