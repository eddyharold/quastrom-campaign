import { Objective } from "./common";

export type CampaignStatus = "active" | "paused" | "ended" | "draft";
export type CommissionModel = "fixed" | "percentage";

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
  campaign_selected_creatives: string[];
  validation_condition_selected: string[];
  objective: Objective;
  created_at: string;
  updated_at: string;
};

export type CampaignStats = {
  total_campaign: number;
  total_budget: number;
  total_conversion: number;
  conversion_rate: number;
};

// {
//   "id": 3,
//   "user_id": 42,
//   "name": "Vente de Boxer Pro",
//   "description": "Campagne 1",
//   "price_lead": null,
//   "status": "draft",
//   "category": "Campagne 1",
//   "budget": "2500.00",
//   "spent": "0.00",
//   "commission_model": "fixed",
//   "commission_value": "50.00",
//   "start_date": "2025-06-20",
//   "end_date": "2025-08-27",
//   "estimated_leads": 50,
//   "conversion_rate": "10.00",
//   "campaign_selected_creatives": "[\"video\",\"email_template\",\"banner\",\"landing\",\"announce\"]",
//   "validation_condition_selected": "[\"signed_quote\"]",
//   "campaign_objective_id": 2,
//   "created_at": "2025-06-21T19:05:18.000000Z",
//   "updated_at": "2025-06-21T19:05:18.000000Z"
// }
