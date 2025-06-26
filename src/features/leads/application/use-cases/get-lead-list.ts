import { useQuery } from "@tanstack/react-query";
import { Lead, LeadStatus } from "@/domain/entities/lead";
import { getLeads } from "../services/leads-service";

export const LEAD_QUERY_KEYS = {
  all: ['leads'] as const,
  list: () => [...LEAD_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...LEAD_QUERY_KEYS.all, 'detail', id] as const,
};

export const useGetLeadList = () => {
  return useQuery<Lead[], unknown, Lead[]>({
    queryKey: LEAD_QUERY_KEYS.list(),
    queryFn: async () => await getLeads()
  });
};

export const useLeadStatistics = (leads: Lead[] | undefined) => {
  if (!leads || leads.length === 0) {
    return {
      pending: 0,
      validated: 0,
      rejected: 0,
      contacted: 0,
      converted: 0,
      total: 0
    };
  }

  const pending = leads.filter(lead => lead.status === "pending").length;
  const validated = leads.filter(lead => lead.status === "validated").length;
  const rejected = leads.filter(lead => lead.status === "rejected").length;
  const contacted = leads.filter(lead => lead.status === "contacted").length;
  const converted = leads.filter(lead => lead.status === "converted").length;
  const total = leads.length;

  return {
    pending,
    validated,
    rejected,
    contacted,
    converted,
    total
  };
};
