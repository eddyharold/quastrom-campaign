import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatusBulk } from "../services/lead-service";
import { LEAD_QUERY } from "@/domain/constants/query";

export const useUpdateLeadStatusBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, selectedLeads }: { action: "accepted" | "rejected"; selectedLeads: string[] }) =>
      updateLeadStatusBulk(action, selectedLeads),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAD_QUERY.default });
    },
  });
};
