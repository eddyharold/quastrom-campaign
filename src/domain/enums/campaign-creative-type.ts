export enum CampaignCreativeType {
  VIDEO = "video",
  EMAIL_TEMPLATE = "email_template",
  BANNER = "banner",
  LANDING = "landing",
  ANNOUNCE = "announce",
}

export const campaignCreativeTypeLabels: Record<CampaignCreativeType, string> = {
  [CampaignCreativeType.VIDEO]: "Video promotionnelle",
  [CampaignCreativeType.EMAIL_TEMPLATE]: "Email template",
  [CampaignCreativeType.BANNER]: "Bannière",
  [CampaignCreativeType.LANDING]: "Landing Page",
  [CampaignCreativeType.ANNOUNCE]: "Annonce",
};
