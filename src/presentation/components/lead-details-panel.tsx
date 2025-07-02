import { formatDateFromPattern } from "@/domain/utils/date";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/presentation/components/ui/sheet";
import { AcquireLead } from "@/domain/entities/lead";
import { buildFullName } from "@/domain/utils/common";
import { LeadStatusBadge } from "./lead-status-badge";

type LeadDetailsPanelProps = {
  lead?: AcquireLead | null;
  isOpen?: boolean;
  onDismiss?: () => void;
};

export const LeadDetailsPanel = ({ lead, isOpen, onDismiss }: LeadDetailsPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onDismiss}>
      <SheetContent className="min-w-3xl">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-semibold">{lead?.code || "Selectionner un lead"}</SheetTitle>
          <SheetDescription className="flex items-center gap-4">
            {lead && <LeadStatusBadge lead={lead} />}
            <span>Aquise le {formatDateFromPattern(lead?.created_at, "dd/MM/yyyy")}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-10 p-6 pt-0">
          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Contact</h5>

            <div className="grid grid-cols-2 gap-6 border rounded-lg p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="text-base font-semibold">
                  {buildFullName(lead?.lead.firstname, lead?.lead.lastname, "-")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                {lead?.lead.email ? (
                  <a
                    href={`mailto:${lead?.lead.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold hover:text-primary underline-offset-4 underline decoration-dashed decoration-from-font"
                  >
                    {lead?.lead.email}
                  </a>
                ) : (
                  <p className="text-base font-semibold">-</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Téléphone</p>
                {lead?.lead.phone ? (
                  <a
                    href={`tel:${lead?.lead.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold hover:text-primary underline-offset-4 underline decoration-dashed decoration-from-font"
                  >
                    {lead?.lead.phone}
                  </a>
                ) : (
                  <p className="text-base font-semibold">-</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pays</p>
                <p className="text-base font-semibold">{lead?.lead.country || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ville</p>
                <p className="text-base font-semibold">{lead?.lead.city || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-lg text-primary font-semibold">Campagne</h5>

            <p className="text-base font-semibold">{lead?.campaign.name}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
