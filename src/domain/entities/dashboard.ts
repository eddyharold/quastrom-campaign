import { Campaign } from "./campaign";

export interface DashboardStats {
  clicks: number;
  leads: number;
  conversions: number;
  conversion_rate: number;
  campaign_recents: Campaign[];
  histogram_data_leads: { date: string; count: number }[];
  histogram_data_clicks: { date: string; count: number }[];
  histogram_data_conversions: { date: string; count: number }[];
}

export type PerformanceAreaChartData = {
  date: string;
  clicks: number;
  leads: number;
  conversions: number;
};
