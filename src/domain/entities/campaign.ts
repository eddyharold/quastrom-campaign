export type CampaignStatus = "active" | "paused" | "ended";
export type CommissionModel = "fixed" | "percentage";
export type CreativeType = "image" | "video" | "landing-page" | "article" | "webinar" | "virtual-tour" | "case-study";

export type Creative = {
  id: number;
  type: CreativeType;
  name: string;
  url: string;
};

export type Campaign = {
  id: number;
  name: string;
  description: string;
  objective: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  createdDate: string;
  category: string;
  budget: number;
  spent: number;
  conversions: number;
  conversionRate: number;
  estimatedCostPerLead: number;
  commissionModel: CommissionModel;
  commissionValue: number;
  conversionTriggers: string[];
  creatives: Creative[];
  lastLeadGenerated: string;
};
