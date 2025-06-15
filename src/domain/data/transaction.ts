import { Transaction } from "../entities/transaction";
import { ALL_CAMPAIGNS } from "./campaign";
import { ALL_USERS } from "./user";

export const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: "2024-01-15 12:00:00",
    type: "top-up",
    amount: 1000,
    campaign: null,
    user: null,
    status: "success",
    description: "Rechargement du portefeuille par carte de crédit",
  },
  {
    id: 2,
    date: "2024-01-14 08:00:00",
    type: "payment",
    amount: 250,
    campaign: ALL_CAMPAIGNS[0],
    user: ALL_USERS[0],
    status: "success",
    description: "Paiement de campagne pour les conversions",
  },
  {
    id: 3,
    date: "2024-01-12 15:02:50",
    type: "payment",
    amount: 180,
    campaign: ALL_CAMPAIGNS[1],
    user: ALL_USERS[1],
    status: "success",
    description: "Paiement de campagne pour les conversions",
  },
  {
    id: 4,
    date: "2024-01-10 16:00:00",
    type: "top-up",
    amount: 500,
    campaign: null,
    user: null,
    status: "success",
    description: "Rechargement du portefeuille via PayPal",
  },
  {
    id: 5,
    date: "2024-01-08 10:00:20",
    type: "payment",
    amount: 320,
    campaign: ALL_CAMPAIGNS[2],
    user: ALL_USERS[2],
    status: "pending",
    description: "Paiement de campagne pour les conversions",
  },
];
