import { Badge } from "./ui/badge";
import { Check, Pause, Play } from "lucide-react";
import { useMemo } from "react";
import { Campaign } from "@/domain/entities/campaign";

export const CampaignStatusBadge = ({ campaign, className }: { campaign: Campaign; className?: string }) => {
  const variant = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return "fade-success";
      case "paused":
        return "warning";
      case "ended":
        return "success";
    }
  }, [campaign]);

  const icon = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return <Play />;
      case "paused":
        return <Pause />;
      case "ended":
        return <Check />;
    }
  }, [campaign]);

  const label = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return "En cours";
      case "paused":
        return "Pause";
      case "ended":
        return "Terminé";
    }
  }, [campaign]);

  return (
    <Badge variant={variant} className={className}>
      {icon}
      {label}
    </Badge>
  );
};
