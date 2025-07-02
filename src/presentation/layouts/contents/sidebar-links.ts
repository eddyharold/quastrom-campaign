import { ArrowLeftRight, LayoutDashboard, Link2, Settings, Users, Book } from "lucide-react";
import { SidebarMenuGroup } from "@/domain/types/sidebar-menu-item";

export const MENU_GROUPS: SidebarMenuGroup[] = [
  {
    title: "Main",
    menus: [
      {
        title: "Tableau de board",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Business",
    menus: [
      {
        title: "Campagnes",
        url: "/campaigns",
        icon: Link2,
      },
      {
        title: "Leads",
        url: "/leads",
        icon: Users,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
];

export const MENU_GROUPS_2: SidebarMenuGroup[] = [
  {
    title: "Configurations",
    menus: [
      {
        title: "Ressources",
        url: "/resources",
        icon: Book,
      },
      {
        title: "Profil",
        url: "/profile",
        icon: Settings,
      },
    ],
  },
];
