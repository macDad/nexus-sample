"use client";
import { navigationRoutes } from "@/data";
import { NavData } from "@/data/nav-data";
import { useMediaQuery } from "@/hooks/client";
import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

export const SubNavBars: FC = () => {
  const pathName = usePathname();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const subRoutes = navigationRoutes.find((route) =>
    pathName.includes(route.href)
  ) as NavData;

  if (isDesktop) {
    return (
      <div key={pathName} className=" fixed z-0 c-fade-in">
        <div className="">
          <h1 className="text-3xl font-semibold">{subRoutes.nav}</h1>
        </div>
        <nav
          className="grid gap-4 text-sm text-muted-foreground translate-y-6 translate-x-2"
          x-chunk="dashboard-04-chunk-0"
        >
          {subRoutes.subRoutes &&
            subRoutes.subRoutes.map((route, index) => (
              <Link
                key={`route-settings-${index}`}
                href={route.href}
                className={cn(
                  "font-semibold flex items-center transition-colors duration-300",
                  pathName === route.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {route.icon &&
                  React.createElement(icons[route.icon], {
                    className: "size-4 mr-1",
                  })}
                {route.nav}
              </Link>
            ))}
        </nav>
      </div>
    );
  }
};
