import { AccountForm } from "@/components/pages/settings/account";
import { WithPreVerifier } from "@/components/pre-verifier-client";
import React from "react";
import { getSession } from "@auth0/nextjs-auth0";

export default async function AccountPage() {
  return (
    <WithPreVerifier>
      <AccountForm />
    </WithPreVerifier>
  );
}
