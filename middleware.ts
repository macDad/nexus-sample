import { NextResponse } from "next/server";
import {
  getSession,
  withMiddlewareAuthRequired,
  updateSession,
} from "@auth0/nextjs-auth0/edge";
import { getUserPermissionsBySession } from "./lib/actions/jwt/get-user-permissions";
import { getUserPermissionsByAuth0 } from "./lib/actions/auth0/management-api/get-user-permissions";

export default withMiddlewareAuthRequired({
  returnTo: "/portal",
  async middleware(request) {
    const res = NextResponse.next();
    if (request.nextUrl.pathname === "/portal") {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url));
    }

    if (request.nextUrl.pathname === "/portal/settings") {
      return NextResponse.redirect(
        new URL("/portal/settings/account", request.url)
      );
    }

    if (request.nextUrl.pathname.startsWith("/api/v1")) {
      const session = await getSession(request, res);
      if (session && session.accessToken) {
        const sessionPermissions = getUserPermissionsBySession(
          session.accessToken
        );
        const authPermissions = await getUserPermissionsByAuth0(session);
        if (sessionPermissions.length !== authPermissions.length) {
          await updateSession(request, res, {
            ...session,
            user: { ...session.user, expired: true },
          });
        }
        const permissions = authPermissions.map((perm) => perm.permission_name);
        res.headers.set("permissions", JSON.stringify(permissions));
        res.headers.set("sub", JSON.stringify(session.user.sub));
      }
    }
    return res;
  },
});

export const config = {
  matcher: ["/portal/:path*", "/api/v1/:path*"],
};
