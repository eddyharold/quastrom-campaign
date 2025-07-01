import { Campaign } from "@/domain/entities/campaign";
import { CampaignCreativeType, campaignCreativeTypeLabels } from "@/domain/enums/campaign-creative-type";
import { LeadConversionTrigger, leadConversionTriggerLabels } from "@/domain/enums/lead-conversion-trigger";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { CampaignStatusBadge } from "@/presentation/components/campaign-status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/presentation/components/ui/sheet";
import { useMemo } from "react";

type CampaignDetailsPanelProps = {
  campaign?: Campaign | null;
  isOpen?: boolean;
  onDismiss?: () => void;
};

export const CampaignDetailsPanel = ({ campaign, isOpen, onDismiss }: CampaignDetailsPanelProps) => {
  const validationConditions: LeadConversionTrigger[] = useMemo(() => {
    if (!campaign?.validation_condition_selected) return [];

    return campaign.validation_condition_selected as LeadConversionTrigger[];
  }, [campaign]);

  const creatives: CampaignCreativeType[] = useMemo(() => {
    if (!campaign?.campaign_selected_creatives) return [];

    return campaign.campaign_selected_creatives as CampaignCreativeType[];
  }, [campaign]);

  return (
    <Sheet open={isOpen} onOpenChange={onDismiss}>
      <SheetContent className="min-w-3xl">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-semibold">{campaign?.name || "Selectionner une campagne"}</SheetTitle>
          <SheetDescription className="flex items-center gap-4">
            {campaign && <CampaignStatusBadge campaign={campaign} />}
            <span>Crée le {formatDateFromPattern(campaign?.created_at, "dd/MM/yyyy")}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-10 p-6 pt-0">
          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Performance</h5>

            <div className="grid grid-cols-2 gap-6 border rounded-lg p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Budget alloué</p>
                <p className="text-base font-semibold">{formatCurrency(Number(campaign?.budget || 0))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Depenses effectuees</p>
                <p className="text-base font-semibold text-destructive">
                  {formatCurrency(Number(campaign?.spent || 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Solde restant</p>
                <p className="text-base font-semibold text-success">
                  {formatCurrency(Number(campaign?.budget || 0) - Number(campaign?.spent || 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Coût par lead</p>
                <p className="text-base font-semibold">{formatCurrency(Number(campaign?.price_lead || 0))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Leads générés</p>
                <p className="text-base font-semibold">{formatNumber(campaign?.estimated_leads || 0)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taux de conversion</p>
                <p className="text-base font-semibold">{formatNumber(Number(campaign?.conversion_rate || 0))}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-lg text-primary font-semibold flex justify-between">
              <span>Evolution des depenses</span>
              <span className="text-foreground">
                {Math.round((Number(campaign?.spent || 0) / Number(campaign?.budget || 1)) * 100)}%
              </span>
            </h5>
            <div className="w-full h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (Number(campaign?.spent || 0) / Number(campaign?.budget || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Objectif & Commission</h5>

            <div className="space-y-4 border rounded-lg p-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">But de la campagne</div>
                <div className="font-semibold text-lg">{campaign?.objective.name}</div>
              </div>

              <div className="h-px border-t border-dashed w-full" />

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Declencheur de conversion</div>
                <ul className="list-disc list-inside space-y-1.5">
                  {validationConditions.map((trigger) => (
                    <li key={trigger}>{leadConversionTriggerLabels[trigger]}</li>
                  ))}
                </ul>
              </div>

              <div className="h-px border-t border-dashed w-full" />

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Modele de commission</div>
                <div className="font-semibold text-lg flex items-center gap-4">
                  <span>{campaign?.commission_model === "fixed" ? "Montant fixe" : "Pourcentage"}</span>
                  <span className="text-muted-foreground">-</span>
                  <div>
                    <span className="text-primary">
                      {campaign?.commission_model === "fixed"
                        ? formatCurrency(Number(campaign?.commission_value || 0))
                        : `${campaign?.commission_value}%`}
                    </span>{" "}
                    {campaign?.commission_model === "fixed" ? "par lead" : "de la conversion"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Creatives</h5>
            <ul className="list-disc list-inside space-y-1.5 border rounded-lg p-4">
              {creatives.map((creative) => (
                <li key={creative}>{campaignCreativeTypeLabels[creative]}</li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Periode</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border border-dashed rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Date de debut</p>
                <p className="font-medium">{formatDateFromPattern(campaign?.start_date, "dd/MM/yyyy")}</p>
              </div>
              <div className="space-y-1 border border-dashed rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Date de fin</p>
                <p className="font-medium">{formatDateFromPattern(campaign?.end_date, "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
