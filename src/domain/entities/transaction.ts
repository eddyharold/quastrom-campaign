import { Campaign } from "./campaign";
import { User } from "./user";

export type TransactionType = "top-up" | "payment";
export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  amount: number;
  campaign?: Campaign | null;
  user?: User | null;
  status: TransactionStatus;
  description: string;
}
