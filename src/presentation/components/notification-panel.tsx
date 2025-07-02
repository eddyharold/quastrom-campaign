import { Bell, Clock, Target } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/presentation/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { capitalizeFirstLetter, cn } from "@/domain/utils/common";
import { ScrollArea } from "./ui/scroll-area";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { useGetAllNotification } from "@/application/use-cases/get-all-notification-query";
import { formatIntervalDateToHuman } from "@/domain/utils/date";
import { NOTIFICATION_COLORS, NOTIFICATION_ICONS } from "@/domain/constants/notification";
import { Notification } from "@/domain/entities/notification";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const Icon = NOTIFICATION_ICONS[notification.icon as keyof typeof NOTIFICATION_ICONS] ?? Target;
  const color = NOTIFICATION_COLORS[notification.type as keyof typeof NOTIFICATION_COLORS] ?? NOTIFICATION_COLORS.info;

  return (
    <div
      key={`notification-${notification.title}`}
      className={cn("flex gap-4 p-4", !notification.read && "bg-muted/50")}
    >
      <Icon className={cn("size-5 transform translate-y-1", color.icon.text)} />
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
};

export function NotificationPanel() {
  const { openNotification, updateNotificationState } = useLayoutContext();

  const { data: notifications, isLoading: isLoadingNotification } = useGetAllNotification();

  const unreadNotifications = useMemo(
    () => notifications?.filter((notification) => !notification.read) || [],
    [notifications]
  );
  const readNotifications = useMemo(
    () => notifications?.filter((notification) => notification.read) || [],
    [notifications]
  );

  return (
    <>
      <div
        onClick={() => updateNotificationState(true)}
        className="relative border-input bg-card dark:bg-background text-foreground hover:bg-accent hover:text-accent-foreground peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px]"
      >
        <Bell size={16} aria-hidden="true" />
        <span className="absolute -top-2 -right-2 size-5 tracking-tighter rounded-lg text-primary-foreground bg-primary flex items-center justify-center text-[0.625rem]">
          {notifications?.length || 0}
        </span>
      </div>

      <Sheet open={openNotification} onOpenChange={updateNotificationState}>
        <SheetContent className="min-w-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notifications
            </SheetTitle>
          </SheetHeader>

          {isLoadingNotification ? (
            <div className="flex flex-col gap-4 h-full px-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={`notification-skeleton-${index}`} className="h-[80px]" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="h-auto rounded-none border-b bg-transparent dark:bg-transparent p-0 w-full">
                <TabsTrigger
                  value="all"
                  className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Toutes
                  <span className="text-xs text-muted-foreground border border-dashed rounded-md size-6 flex items-center justify-center">
                    {notifications?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="read"
                  className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Lues
                  <span className="text-xs text-muted-foreground border border-dashed rounded-md size-6 flex items-center justify-center">
                    {readNotifications.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Non lues
                  <span className="text-xs text-muted-foreground border border-dashed rounded-md size-6 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="divide-y">
                    {notifications?.map((notification) => (
                      <NotificationCard key={`notification-card-${notification.title}`} notification={notification} />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="read">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="divide-y">
                    {readNotifications.map((notification) => (
                      <NotificationCard
                        key={`read-notification-card-${notification.title}`}
                        notification={notification}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="unread">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="divide-y">
                    {unreadNotifications.map((notification) => (
                      <NotificationCard
                        key={`unread-notification-card-${notification.title}`}
                        notification={notification}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
