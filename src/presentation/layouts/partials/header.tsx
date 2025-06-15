import React from "react";
import { Separator } from "@/presentation/components/ui/separator";
import { SidebarTrigger } from "@/presentation/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/presentation/components/ui/breadcrumb";
import { ModeToggle } from "@/presentation/components/mode-toggle";
import UserDropdown from "@/presentation/components/user-dropdown";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { cn } from "@/domain/utils/common";
import { Link } from "react-router";
import { NotificationPanel } from "@/presentation/components/notification-panel";

export function AppHeader() {
  const { breadcrumb } = useLayoutContext();

  return (
    <header className="flex bg-card dark:bg-background sticky top-0 z-50 border-b h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />

        <div className="max-lg:hidden lg:contents">
          <Separator orientation="vertical" className="me-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={`breadcrumb-fragment-${index}`}>
                  <BreadcrumbItem key={`breadcrumb-item-${index}`} className={cn(!item.isActive && "hidden md:block")}>
                    {item.isActive ? (
                      <BreadcrumbPage className="font-semibold">{item.title}</BreadcrumbPage>
                    ) : item.link ? (
                      <BreadcrumbLink key={`breadcrumb-link-${item.link}`} asChild>
                        <Link to={item.link}>{item.title}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-semibold">{item.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {index < breadcrumb.length - 1 && (
                    <BreadcrumbSeparator key={`breadcrumb-separator-${index}`} className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <NotificationPanel />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
