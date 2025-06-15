import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";
import { MENU_GROUPS } from "@/presentation/layouts/contents/sidebar-links";
import { Link, useLocation } from "react-router";

import logo from "@/assets/images/logo-full.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isLinkActive = React.useCallback(
    (url: string) => location.pathname === url || (url !== "/" && location.pathname.startsWith(url)),
    [location.pathname]
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto hover:bg-transparent"
            >
              <img src={logo} alt="Quastrom-Renov" className="w-40" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {MENU_GROUPS.map((group) =>
          !group.roles || group.roles?.length == 0 ? (
            <SidebarGroup key={group.title}>
              {group.title && (
                <SidebarGroupLabel className="uppercase dark:text-muted-foreground/60 text-muted-foreground">
                  {group.title}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {group.menus?.map(
                    (menu) =>
                      menu.url && (
                        <SidebarMenuItem key={menu.title}>
                          <SidebarMenuButton
                            asChild
                            data-active={isLinkActive(menu.url)}
                            className="group/menu-button font-medium gap-3 h-9 rounded-md [&>svg]:size-auto"
                          >
                            <Link to={menu.url}>
                              {menu.icon && (
                                <menu.icon className="group-hover/menu-button:text-primary-foreground group-data-[active=true]/menu-button:text-primary-foreground !size-5" />
                              )}
                              <span>{menu.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null
        )}
      </SidebarContent>
    </Sidebar>
  );
}
