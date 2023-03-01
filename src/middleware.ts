import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const requestForNextAuth = {
    headers: {
      cookie: (await req.headers.get("cookie")) || "",
    },
  };
  const session = await getSession({ req: requestForNextAuth } as any);

  console.log("session", session);


if (session?.error != undefined && session.error === "TokenExpiredError") {
  return NextResponse.rewrite(new URL("/signIn", req.url));
}


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/debt/:path*"],
};