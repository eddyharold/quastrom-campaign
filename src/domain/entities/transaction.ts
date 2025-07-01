import { GenericType } from "../types/common";
import { Campaign } from "./campaign";
import { User } from "./user";

export type TransactionType = "top_up" | "withdraw";
export type TransactionStatus = "success" | "pending" | "failed";

export interface TransactionStats {
  recharges: number;
  withdraws: number;
  in_progress: number;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: string;
  balance_before: string;
  balance_after: string;
  status: TransactionStatus;
  reference: string | null;
  payment_method: string | null;
  external_transaction_id: string | null;
  description: string;
  metadata: GenericType | null;
  processed_at: string | null;
  wallet_id: number;
  campaign_id: number | null;
  lead_id: number | null;
  created_at: string;
  updated_at: string;
  date?: string;
  campaign?: Campaign | null;
  user?: User | null;
}

export interface TransactionStats {
  recharges: number;
  withdraws: number;
  in_progress: number;
}
