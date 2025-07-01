import { z } from "zod";

export const RechargeWalletDtoSchema = z.object({
  payment_method: z.string().min(1, "La méthode de paiement est requise"),
  amount: z.number().min(100, "Le montant minimum est de 100")
});

export type RechargeWalletDto = z.infer<typeof RechargeWalletDtoSchema>;
