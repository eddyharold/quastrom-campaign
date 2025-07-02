import { Badge } from "./ui/badge";
import { Loader2, Pause, Play, StopCircle } from "lucide-react";
import { useMemo } from "react";
import { Campaign } from "@/domain/entities/campaign";

export const CampaignStatusBadge = ({ campaign, className }: { campaign: Campaign; className?: string }) => {
  const variant = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "ended":
        return "fade-success";
      case "draft":
        return "accent";
    }
  }, [campaign]);

  const icon = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return <Play />;
      case "paused":
        return <Pause />;
      case "ended":
        return <StopCircle />;
      case "draft":
        return <Loader2 />;
    }
  }, [campaign]);

  const label = useMemo(() => {
    switch (campaign.status) {
      case "active":
        return "En cours";
      case "paused":
        return "Pause";
      case "ended":
        return "Clôturé";
      case "draft":
        return "Stand By";
    }
  }, [campaign]);

  return (
    <Badge variant={variant} className={className}>
      {icon}
      {label}
    </Badge>
  );
};
