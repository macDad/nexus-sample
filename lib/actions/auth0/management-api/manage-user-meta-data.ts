"use server";

import { UserMetdataJSON } from "@/typings";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { getManagementToken } from "./get-management-token";

export async function setUserMetaData({
  metadata,
  picture,
}: {
  metadata?: UserMetdataJSON;
  picture?: string;
}): Promise<any> {
  const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;

  const session = await getSession();
  if (!session) throw new Error("Unauthorized!");

  const access_token = await getManagementToken();
  const payload: Record<string, any> = { user_metadata: metadata };

  if (picture) {
    payload.picture = picture;
  }

  const response = await fetch(
    `${AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();
  if (picture) session.user.picture = data.picture;
  await updateSession({
    ...session,
    user: {
      ...session.user,
      ...{ user_metadata: { ...data.user_metadata } },
    },
  });

  return data;
}
