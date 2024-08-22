"use client";
import Link from "next/link";
import { icons, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import logo from "@/public/assets/logo.jpg";
import { navigationRoutes } from "@/data";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/client";
import { usePathname } from "next/navigation";
import React, { FC } from "react";
import { UserButton } from "./user-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@auth0/nextjs-auth0/client";

export const NavBar: FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const pathName = usePathname();
  const { user } = useUser();

  if (isDesktop) {
    return (
      <header className="fixed top-0 w-full flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Image src={logo} alt="logo" className=" max-w-14" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {user &&
            navigationRoutes.map((route, index) => (
              <Link
                key={`nav-link-${index}-${route.href}`}
                href={route.href}
                className={cn(
                  "transition-colors",
                  pathName.includes(
                    route.href.split("/")[route.href.split("/").length - 1]
                  )
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {route.nav}
              </Link>
            ))}
        </nav>
        <div className="flex w-full items-center gap-4 justify-end md:ml-auto md:gap-2 lg:gap-4">
          <UserButton />
        </div>
      </header>
    );
  } else {
    return (
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        {user ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-x-6 text-lg font-medium">
                <Link
                  href={"/"}
                  className="flex items-center gap-2 text-lg font-semibold mb-10"
                >
                  <Image src={logo} alt="logo" className=" max-w-16" />
                </Link>

                {navigationRoutes.map((route, index) => (
                  <React.Fragment key={`nav-sheet-item-${index}`}>
                    {!route.subRoutes ? (
                      <Link
                        href={route.href}
                        className={cn(
                          "hover:text-foreground",
                          pathName.includes(
                            route.href.split("/")[
                              route.href.split("/").length - 1
                            ]
                          )
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {route.nav}
                      </Link>
                    ) : (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        key={`accordion-${index}`}
                      >
                        <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger>
                            <Link
                              href={route.href}
                              className={cn(
                                "hover:text-foreground",
                                pathName.includes(
                                  route.href.split("/")[
                                    route.href.split("/").length - 1
                                  ]
                                )
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              {route.nav}
                            </Link>
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col space-y-1 text-base">
                            {route.subRoutes.map((nav, subIndex) => (
                              <Link
                                key={`sub-link-${subIndex}-${nav.href}`}
                                href={nav.href}
                                className={cn(
                                  "hover:text-foreground ml-2 flex items-center",
                                  pathName === nav.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              >
                                {nav.icon &&
                                  React.createElement(icons[nav.icon], {
                                    className: "size-4 mr-2",
                                  })}
                                {nav.nav}
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <Image src={logo} alt="logo" className=" w-14" />
        )}
        <div className="flex w-full items-center gap-4 justify-end md:ml-auto md:gap-2 lg:gap-4">
          <UserButton />
        </div>
      </header>
    );
  }
};
