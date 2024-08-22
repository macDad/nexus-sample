"use client";
import { getUserRolesBySession } from "@/lib/actions/jwt/get-user-roles";
import { RolePermission, UserRoles } from "@/typings";
import { useUser } from "@auth0/nextjs-auth0/client";
import React, { FC, useEffect, useState } from "react";

export const WithPermissions: FC<{
  children: React.ReactNode;
  roles: UserRoles[];
}> = ({ roles, children }) => {
  const { user } = useUser();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function getRoles() {
      const rolesData = await getUserRolesBySession();

      const data = rolesData.filter((permission) =>
        permission.sources.some((source) =>
          roles.includes(source.source_name as any)
        )
      );
      if (data.length > 0) {
        setVerified(true);
      }
    }
    if (user) {
      getRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user) {
    return <>{verified && <>{children}</>}</>;
  }
};
