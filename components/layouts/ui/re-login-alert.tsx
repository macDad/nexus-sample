"use client";
import { Button } from "@/components/ui/button";
import { FC } from "react";

export const ReLogInAlert: FC = () => {
  return (
    <div className=" w-full p-2 bg-primary text-white flex items-center justify-between translate-y-16 fixed z-40">
      <p className=" text-sm">{`It's looks like your granted permissions have been changed! try to log back in`}</p>
      <Button
        onClick={() =>
          (window.location.href = "/api/auth/login?returnTo=/portal")
        }
        variant={"secondary"}
        className=" text-sm py-0"
        type="submit"
      >
        Log back in
      </Button>
    </div>
  );
};
