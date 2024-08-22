"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2 } from "lucide-react";
import { FC, PropsWithChildren } from "react";

export const WithPreVerifier: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return (
      <div className=" w-full h-screen fixed left-0 top-0 sm:col-span-3 flex items-center justify-center bg-background z-50">
        <div className=" animate-pulse">
          <Loader2 className=" size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  } else if (user) {
    return <div className="c-fade-in">{children}</div>;
  }
};
