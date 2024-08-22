"use server";
import { RolePermission } from "@/typings";
import { Session } from "@auth0/nextjs-auth0";
import { getManagementToken } from "./get-management-token";

export async function getUserPermissionsByAuth0(
  session: Session
): Promise<RolePermission[]> {
  const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;

  if (!session) throw new Error("Unauthorized!");

  const access_token = await getManagementToken();

  const response = await fetch(
    `${AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}/permissions`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = (await response.json()) as RolePermission[];

  return data;
}
