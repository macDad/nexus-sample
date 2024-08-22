export type UserPermissions =
  | "create:events"
  | "get:events"
  | "delete:events"
  | "get:all-events"
  | "update:events";

export type UserRoles = "admin" | "company";

export interface UserMetadata {
  address: string;
  bio: string;
  company_name: string;
  country: string;
  lane: string;
  secondary_email: string;
}

export interface JWTData {
  user_metadata: UserMetadata;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  scope: string;
  azp: string;
  permissions: UserPermissions[];
  roles_permissions : RolePermission[]
}

import { UserProfile } from "@auth0/nextjs-auth0/client";

export interface UserMetdataJSON {
  address: string;
  bio: string;
  company_name: string;
  country: string;
  lane: string;
  secondary_email: string;
  image_url: string | null;
}

export interface SessionUser extends UserProfile {
  user_metadata?: UserMetdataJSON;
}

interface RolePermissionSource {
  source_id: string;
  source_name: string;
  source_type: "ROLE";
}

export interface RolePermission {
  permission_name: string;
  description: string;
  resource_server_name: string;
  resource_server_identifier: string;
  sources: RolePermissionSource[];
}
