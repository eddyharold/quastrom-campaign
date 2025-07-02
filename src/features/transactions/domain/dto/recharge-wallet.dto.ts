import { z } from "zod";

export const RechargeWalletDtoSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Le montant doit être un nombre valide"),
});

export type RechargeWalletDto = z.infer<typeof RechargeWalletDtoSchema>;
