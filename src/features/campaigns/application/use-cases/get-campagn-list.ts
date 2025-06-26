import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/domain/entities/campaign";
import { getcampagn } from "../services/campaigns-service";

export const CAMPAIGN_QUERY_KEYS = {
  all: ['campaigns'] as const,
  list: () => [...CAMPAIGN_QUERY_KEYS.all, 'list'] as const,
};

/**
 * Hook pour recuperer la liste des campagnes
 * @returns Hook avec la liste des campagnes
 */
export const useGetCampaignList = () => {
  return useQuery<Campaign[], unknown, Campaign[]>({    
    queryKey: CAMPAIGN_QUERY_KEYS.list(),
    queryFn: async () => await getcampagn()
  });
};

/**
 * Hook pour tranformer les statistiques des campagnes
 * @returns Hook avec les statistiques des campagnes
 */
export const useCampaignStatistics = (campaigns: Campaign[] | undefined) => {
  if (!campaigns || campaigns.length === 0) {
    return {
      totalCampaigns: 0,
      totalActiveCampaigns: 0,
      investments: 0,
      alreadySpend: 0,
      totalConverted: 0,
      avgConversionRate: 0,
    };
  }

  const totalCampaigns = campaigns.length;
  const totalActiveCampaigns = campaigns.filter((campaign) => campaign.status === "active").length;
  const investments = campaigns.reduce((total, campaign) => total + Number(campaign.budget), 0);
  const alreadySpend = campaigns.reduce((total, campaign) => total + Number(campaign.spent), 0);
  
  const totalConverted = campaigns.reduce((total, campaign) => {
    const estimatedLeads = campaign.estimated_leads || 0;
    return total + estimatedLeads;
  }, 0);
  
  const avgConversionRate = totalCampaigns > 0 ? 
    Math.round(campaigns.reduce((total, campaign) => total + parseFloat(campaign.conversion_rate), 0) / totalCampaigns) : 0;

  return {
    totalCampaigns,
    totalActiveCampaigns,
    investments,
    alreadySpend,
    totalConverted,
    avgConversionRate,
  };
};
