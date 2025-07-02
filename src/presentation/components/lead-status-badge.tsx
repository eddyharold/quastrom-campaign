import { AcquireLead } from "@/domain/entities/lead";
import { Badge } from "./ui/badge";
import { CheckCircle2, Loader, XCircle } from "lucide-react";
import { useMemo } from "react";

export const LeadStatusBadge = ({ lead, className }: { lead: AcquireLead; className?: string }) => {
  const variant = useMemo(() => {
    switch (lead.status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "destructive";
    }
  }, [lead]);

  const icon = useMemo(() => {
    switch (lead.status) {
      case "accepted":
        return <CheckCircle2 />;
      case "pending":
        return <Loader />;
      case "rejected":
        return <XCircle />;
    }
  }, [lead]);

  const label = useMemo(() => {
    switch (lead.status) {
      case "accepted":
        return "Accepté";
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
