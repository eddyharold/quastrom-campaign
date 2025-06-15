import { Campaign } from "@/domain/entities/campaign";
import { formatCurrency, formatNumber } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";
import { CampaignStatusBadge } from "@/presentation/components/campaign-status-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/presentation/components/ui/sheet";

type CampaignDetailsPanelProps = {
  campaign?: Campaign | null;
  isOpen?: boolean;
  onDismiss?: () => void;
};

const conversionTriggerLabels = {
  "signed-quote": "Devis Signé",
  "confirmed-sale": "Vente Confirmée",
  "appointment-booked": "Rendez-vous Confirmé",
  "qualified-lead": "Lead Qualifié",
};

export const CampaignDetailsPanel = ({ campaign, isOpen, onDismiss }: CampaignDetailsPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onDismiss}>
      <SheetContent className="min-w-3xl">
        <SheetHeader className="p-6">
          <SheetTitle className="text-xl font-semibold">{campaign?.name || "Selectionner une campagne"}</SheetTitle>
          <SheetDescription className="flex items-center gap-4">
            {campaign && <CampaignStatusBadge campaign={campaign} />}
            <span>Crée le {formatDateFromPattern(campaign?.createdDate, "dd/MM/yyyy")}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-10 p-6 pt-0">
          <div className="space-y-4">
            <h5 className="text-base font-semibold">Performance</h5>

            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Budget Allocated</p>
                <p className="text-base font-semibold">{formatCurrency(campaign?.budget)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Amount Spent</p>
                <p className="text-base font-semibold text-destructive">{formatCurrency(campaign?.spent)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Remaining Balance</p>
                <p className="text-base font-semibold text-success">
                  {formatCurrency((campaign?.budget || 0) - (campaign?.spent || 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Est. Cost per Lead</p>
                <p className="text-base font-semibold">{formatCurrency(campaign?.estimatedCostPerLead)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Leads Generated</p>
                <p className="text-base font-semibold">{formatNumber(campaign?.conversions)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-base font-semibold">{formatNumber(campaign?.conversionRate)}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-base font-semibold flex justify-between">
              <span>Depenses effectuees</span>
              <span>{Math.round(((campaign?.spent || 0) / (campaign?.budget || 0)) * 100)}%</span>
            </h5>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${((campaign?.spent || 0) / (campaign?.budget || 0)) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-base font-semibold">Objective & Commission</h5>

            <div className="space-y-4 border rounded-lg p-4">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">But de la campagne</div>
                <div className="font-semibold">{campaign?.objective}</div>
              </div>

              <div className="h-px border-t border-dashed w-full" />

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Declencheur de conversion</div>
                <ul className="list-disc list-inside space-y-1.5">
                  {campaign?.conversionTriggers.map((trigger) => (
                    <li key={trigger}>{conversionTriggerLabels[trigger as keyof typeof conversionTriggerLabels]}</li>
                  ))}
                </ul>
              </div>

              <div className="h-px border-t border-dashed w-full" />

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Modele de commission</div>
                <div className="font-semibold">
                  {campaign?.commissionModel === "fixed" ? "Montant fixe:" : "Pourcentage:"}{" "}
                  <span className="text-primary">
                    {campaign?.commissionModel === "fixed"
                      ? formatCurrency(campaign?.commissionValue)
                      : `${campaign?.commissionValue}%`}
                  </span>{" "}
                  {campaign?.commissionModel === "fixed" ? "par lead" : "de la conversion"}
                </div>
              </div>
            </div>
          </div>

          {/* Creatives */}
          {/* <div>
            <h5>Creatives</h5>
            <div className="space-y-3">
              {campaign?.creatives.map((creative) => {
                return (
                  <div key={creative.id} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">{creative.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{creative.type.replace("-", " ")}</p>
                  </div>
                );
              })}
            </div>
          </div> */}

          {/* Timeline */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold">Periode</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border border-dashed rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Date de debut</p>
                <p className="font-medium">{formatDateFromPattern(campaign?.startDate, "dd/MM/yyyy")}</p>
              </div>
              <div className="space-y-1 border border-dashed rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Date de fin</p>
                <p className="font-medium">{formatDateFromPattern(campaign?.endDate, "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
