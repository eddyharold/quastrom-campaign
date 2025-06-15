import type { Campaign } from "./campaign";

export type LeadStatus = "pending" | "validated" | "rejected" | "contacted" | "converted";

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  campaign: Campaign;
  status: LeadStatus;
  receivedAt: string;
  price: number;
  notes: string;
};
