"use client";

import { cn } from "@/domain/utils/common";
import { CheckCircle, AlertTriangle, Target, DollarSign, TrendingUp, MessageSquare } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    title: "Budget Alert",
    message: "B2B Software Leads campaign has spent 80% of its budget",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    icon: Target,
    title: "Conversion Validation",
    message: "12 new leads require validation for payment processing",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "accent",
    icon: DollarSign,
    title: "Wallet Balance Low",
    message: "Your wallet balance is below $500",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    icon: TrendingUp,
    title: "Campaign Performance",
    message: "Financial Services campaign exceeded conversion targets by 25%",
    timestamp: "2 days ago",
    read: false,
  },
  {
    id: 5,
    type: "info",
    icon: MessageSquare,
    title: "New Comment",
    message: "Affiliate partner left a comment on Healthcare campaign",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 6,
    type: "success",
    icon: CheckCircle,
    title: "Payment Processed",
    message: "Wallet top-up of $1,000 has been successfully processed",
    timestamp: "3 days ago",
    read: true,
  },
];

const NOTIFICATION_COLORS = {
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: {
      bg: "bg-warning/40",
      text: "text-warning",
    },
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/20",
    icon: {
      bg: "bg-info/40",
      text: "text-info",
    },
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-input",
    icon: {
      bg: "bg-accent/40",
      text: "text-accent",
    },
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    icon: {
      bg: "bg-success/40",
      text: "text-success",
    },
  },
};

export function SystemAlert() {
  return (
    <div className="space-y-2">
      {NOTIFICATIONS.map((notification) => {
        const color = NOTIFICATION_COLORS[notification.type as keyof typeof NOTIFICATION_COLORS];

        return (
          <div
            key={`sys-alert-${notification.id}`}
            className={cn("flex gap-2 border rounded-md p-2", color.bg, color.border)}
          >
            <div
              className={cn(
                "rounded-md size-6 flex items-center justify-center transform translate-y-0.5",
                color.icon.bg
              )}
            >
              <notification.icon className="size-2.5 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
