import type { Campaign } from "./campaign";

export type LeadStatus = "pending" | "accepted" | "rejected";

export type AcquireLead = {
  id: number;
  code: string;
  lead: Lead;
  campaign: Campaign;
  status: LeadStatus;
  created_at: string;
};

export type Lead = {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
};

export interface LeadStats {
  pending: number;
  accepted: number;
  rejected: number;
  total: number;
}
