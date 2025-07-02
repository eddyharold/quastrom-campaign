import { AlertTriangle, Target, DollarSign, TrendingUp, MessageSquare, Info, CheckCircle2 } from "lucide-react";

export const NOTIFICATION_COLORS = {
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

export const NOTIFICATION_ICONS = {
  "exclamation-triangle": AlertTriangle,
  target: Target,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  "message-square": MessageSquare,
  "check-circle": CheckCircle2,
  "info-circle": Info,
};
