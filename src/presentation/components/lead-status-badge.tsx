import { Lead } from "@/domain/entities/lead";
import { Badge } from "./ui/badge";
import { Check, CheckCheck, Loader, Phone, XCircle } from "lucide-react";
import { useMemo } from "react";

export const LeadStatusBadge = ({ lead, className }: { lead: Lead; className?: string }) => {
  const variant = useMemo(() => {
    switch (lead.status) {
      case "contacted":
      case "validated":
        return "fade-success";
      case "pending":
        return "warning";
      case "converted":
        return "success";
      case "rejected":
        return "destructive";
    }
  }, [lead]);

  const icon = useMemo(() => {
    switch (lead.status) {
      case "contacted":
        return <Phone />;
      case "converted":
        return <CheckCheck />;
      case "validated":
        return <Check />;
      case "pending":
        return <Loader />;
      case "rejected":
        return <XCircle />;
    }
  }, [lead]);

  const label = useMemo(() => {
    switch (lead.status) {
      case "contacted":
        return "Contacté";
      case "validated":
        return "Validé";
      case "converted":
        return "Converti";
      case "pending":
        return "En attente";
      case "rejected":
        return "Rejeté";
    }
  }, [lead]);

  return (
    <Badge variant={variant} className={className}>
      {icon}
      {label}
    </Badge>
  );
};
