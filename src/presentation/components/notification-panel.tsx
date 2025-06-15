import { Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/presentation/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { ALL_NOTIFICATIONS } from "@/domain/data/notification";
import { cn } from "@/domain/utils/common";
import { ScrollArea } from "./ui/scroll-area";

export function NotificationPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative border-input bg-card dark:bg-background text-foreground hover:bg-accent hover:text-accent-foreground peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px]">
          <Bell size={16} aria-hidden="true" />
          <span className="absolute -top-2 -right-2 size-5 tracking-tighter rounded-lg text-primary-foreground bg-primary flex items-center justify-center text-[0.625rem]">
            12
          </span>
        </div>
      </SheetTrigger>

      <SheetContent className="min-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notifications
          </SheetTitle>

          {/* <SheetDescription className="flex items-center justify-between pt-4">
            <Button variant="ghost" size="xs" className="text-xs">
              <CheckCheck /> Marquer tout comme lu
            </Button>
          </SheetDescription> */}
        </SheetHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="h-auto rounded-none border-b bg-transparent dark:bg-transparent p-0 w-full">
            <TabsTrigger
              value="all"
              className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Toutes
              <span className="text-xs text-muted-foreground border border-dashed rounded-md p-1">12</span>
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Lues
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex items-center text-muted-foreground gap-3 data-[state=active]:after:bg-primary relative rounded-none px-4 py-2 after:absolute after:inset-x-0 after:-bottom-1 after:h-1 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:text-foreground dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Non lues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="divide-y">
                {ALL_NOTIFICATIONS.map((notification) => (
                  <div
                    key={`notification-${notification.title}`}
                    className={cn("flex grow flex-col gap-1 p-4", !notification.read && "bg-muted/50")}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="read">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="divide-y">
                {ALL_NOTIFICATIONS.filter((notification) => notification.read).map((notification) => (
                  <div key={`notification-${notification.title}`} className="flex grow flex-col gap-1 p-4">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="divide-y">
                {ALL_NOTIFICATIONS.filter((notification) => !notification.read).map((notification) => (
                  <div key={`notification-${notification.title}`} className="flex grow flex-col gap-1 p-4 bg-muted/50">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
