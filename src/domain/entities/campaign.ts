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
  user_id: number;
  name: string;
  description: string;
  price_lead: number | null;
  status: CampaignStatus;
  category: string;
  budget: string;
  spent: string;
  commission_model: CommissionModel;
  commission_value: string;
  start_date: string;
  end_date: string;
  estimated_leads: number;
  conversion_rate: string;
  campaign_selected_creatives: string;
  validation_condition_selected: string;
  campaign_objective_id: number;
  created_at: string;
  updated_at: string;
  creatives?: Creative[];
};
