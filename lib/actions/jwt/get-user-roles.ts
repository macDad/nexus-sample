"use server";

import { JWTData, RolePermission } from "@/typings";
import { getSession } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";

export async function getUserRolesBySession(): Promise<RolePermission[]> {
  const session = await getSession();

  if (!session || !session.accessToken) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.decode(session.accessToken) as JWTData;

    if (decoded && decoded.roles_permissions) {
      return decoded.roles_permissions;
    } else {
      throw new Error("Permissions array not found or invalid in the token");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
