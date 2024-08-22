"use client";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Dashboard() {
  return (
    <div className=" w-full">
      <div className=" w-full flex justify-end p-4">
        <Button onClick={ () => window.location.href = "/api/auth/login?returnTo=/portal/dashboard"}>Login</Button>
      </div>
      Home
    </div>
  );
}
