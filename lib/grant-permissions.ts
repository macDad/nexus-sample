import { UserPermissions } from "@/typings";

export function GrantPermissions(
  required: UserPermissions[],
  request: UserPermissions[]
): boolean {
  if (!required.every((permission) => request.includes(permission))) {
    return true;
  } else {
    return false;
  }
}
