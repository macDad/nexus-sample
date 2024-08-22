"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useImageExists from "@/hooks/client/use-image-exists";
import { cn } from "@/lib/utils";
import { UserMetdataJSON } from "@/typings";
import { useUser } from "@auth0/nextjs-auth0/client";
import { HelpingHand, Loader2, LogOut, Settings2, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";

export const UserButton: FC = () => {
  const { isLoading, user } = useUser();
  const [routing, setRouting] = useState(false);
  const [userProfileData, setUserProfileData] = useState<
    UserMetdataJSON | undefined
  >(undefined);

  const pathName = usePathname();
  const router = useRouter();
  const { exists, checking } = useImageExists();
  const [count, setCount] = useState(0);

  useMemo(() => {
    if (user) {
      setRouting(false);
      setUserProfileData(user.user_metadata as UserMetdataJSON);
      setCount((prev) => prev + 1);
    }
  }, [user]);

  return (
    <>
      {isLoading || checking ? (
        <Skeleton className=" w-12 h-12 rounded-full" />
      ) : user ? (
        <DropdownMenu>
          <p className=" text-sm text-muted-foreground">
            {userProfileData?.company_name || user.email}
          </p>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={'ghost'} className="rounded-full">
              <Avatar className="size-full cursor-pointer ring-offset-2 ring-2 ring-slate-200">
                {exists && user && (
                  <AvatarImage
                    key={`${count}`}
                    src={user.picture as string}
                    alt={user.picture as string}
                    className="object-cover"
                  />
                )}
                <AvatarFallback>
                  {checking ? (
                    <Skeleton className=" w-full h-full" />
                  ) : (
                    !exists && (
                      <User2 className=" size-[60%] sm:size-[80%] text-primary" />
                    )
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center uppercase tracking-widest text-primary">
              { userProfileData && userProfileData.company_name && userProfileData.company_name.split(" ")[0] || user.nickname}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/portal/settings")}
              className=" cursor-pointer flex items-center"
            >
              <Settings2 className=" size-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className=" cursor-pointer flex items-center">
              <HelpingHand className=" size-4 mr-2" />
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-secondary">
              <button
                className="cursor-pointer h-full flex items-center hover:text-destructive transition-colors duration-300 hover:bg-secondary w-full"
                onClick={() => {
                  setRouting(true);
                  window.location.href = "/api/auth/logout";
                }}
              >
                <LogOut className=" size-4 mr-2" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant={"destructive"}
          onClick={() => {
            setRouting(true);
            window.location.href = `/api/auth/login?returnTo=${pathName}`;
          }}
          disabled={routing}
          className={cn(
            " w-16",
            routing && "animate-pulse disabled:animate-pulse"
          )}
        >
          {routing ? <Loader2 className=" size-4 animate-spin" /> : "Login"}
        </Button>
      )}
    </>
  );
};
