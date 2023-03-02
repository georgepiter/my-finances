import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { verifyAuth } from "./libs/auth";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;
  
  const verifiedToken =
    token && (await verifyAuth(token).catch((err) => {
      console.log(err);
    }));

  if (!verifiedToken) {
    return NextResponse.rewrite(new URL("/signIn", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/debt/:path*",
    "/register/:path*",
  ],
};
