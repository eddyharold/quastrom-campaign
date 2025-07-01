export enum LeadConversionTrigger {
  SIGNED_QUOTE = "signed_quote",
  SALE_CONFIRMED = "sale_confirmed",
  APPOINTMENT = "appointment",
  CARD_QUALIFIED = "card_qualified",
}

export const leadConversionTriggerLabels: Record<LeadConversionTrigger, string> = {
  [LeadConversionTrigger.SIGNED_QUOTE]: "Devis Signé",
  [LeadConversionTrigger.SALE_CONFIRMED]: "Vente Confirmée",
  [LeadConversionTrigger.APPOINTMENT]: "Rendez-vous Confirmé",
  [LeadConversionTrigger.CARD_QUALIFIED]: "Lead Qualifié",
};
