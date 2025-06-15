import { LucideIcon } from "lucide-react";

export type SidebarMenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  roles?: string[];
  subs?: SidebarMenuItem[];
};

export type SidebarMenuGroup = {
  title: string;
  roles?: string[];
  menus?: SidebarMenuItem[];
};
