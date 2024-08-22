import { PropsWithChildren } from "react";
import { NavBar } from "./ui/nav-bar";
import { SubNavBars } from "./ui/sub-nav-bar";
import { getSession } from "@auth0/nextjs-auth0";
import { cn } from "@/lib/utils";
import { ReLogInAlert } from "./ui/re-login-alert";
import { EventsProvider } from "@/hooks/client";

export async function Dashboard({ children }: PropsWithChildren) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      {session && session.user.expired && <ReLogInAlert />}

      <main
        className={cn(
          "flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10",
          session && session.user.expired ? " mt-14 sm:mt-5" : "sm:mt-0"
        )}
      >
        <div className="flex w-full lg:w-[70vw] mx-auto flex-col">
          <main className=" sm:grid sm:grid-cols-4 sm:pt-20 gap-20 lg:gap-0">
            <div className="mx-auto w-full max-w-6xl items-start sm:col-span-1">
              <SubNavBars />
            </div>
            <div className=" sm:col-span-3 h-full">
              <EventsProvider>{children}</EventsProvider>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
