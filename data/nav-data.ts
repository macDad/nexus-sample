import { icons } from "lucide-react";

export interface NavData {
  nav: string;
  href: string;
  icon?: keyof typeof icons;
  subRoutes?: NavData[];
}

export const navigationRoutes: NavData[] = [
  {
    nav: "Dashboard",
    href: "/portal/dashboard",
    subRoutes: [
      {
        nav: "Events",
        href: "/portal/dashboard/events",
        icon: "CalendarHeart",
      },
      {
        nav: "Registered Users",
        href: "/portal/dashboard/registered-users",
        icon: "UserCheck",
      },
    ],
  },
  {
    nav: "Settings",
    href: "/portal/settings",
    subRoutes: [
      {
        nav: "Account Settings",
        href: "/portal/settings/account",
        icon: "User",
      },
      {
        nav: "Portal Settings",
        href: "/portal/settings/portals",
        icon: "Projector",
      },
      {
        nav: "Manage Users Settings",
        href: "/portal/settings/users",
        icon: "UserPen",
      },
    ],
  },
];
