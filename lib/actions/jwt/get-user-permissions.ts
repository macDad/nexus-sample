"use server";

import { JWTData, UserPermissions } from "@/typings";
import jwt from "jsonwebtoken";

export function getUserPermissionsBySession(token: string): UserPermissions[] {
  try {
    const decoded = jwt.decode(token) as JWTData;

    if (decoded && decoded.permissions) {
      return decoded.permissions;
    } else {
      throw new Error("Permissions array not found or invalid in the token");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
}