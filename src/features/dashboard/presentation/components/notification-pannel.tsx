import { NOTIFICATION_COLORS, NOTIFICATION_ICONS } from "@/domain/constants/notification";
import { Notification } from "@/domain/entities/notification";
import { capitalizeFirstLetter, cn } from "@/domain/utils/common";
import { formatIntervalDateToHuman } from "@/domain/utils/date";
import { Clock, Target } from "lucide-react";

export function SystemAlert({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => {
        const color =
          NOTIFICATION_COLORS[notification.type as keyof typeof NOTIFICATION_COLORS] ?? NOTIFICATION_COLORS.info;
        const Icon = NOTIFICATION_ICONS[notification.icon as keyof typeof NOTIFICATION_ICONS] ?? Target;

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
              <Icon className="size-2.5 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Clock className="size-3" />{" "}
                {capitalizeFirstLetter(formatIntervalDateToHuman(notification.created_at, new Date()))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
