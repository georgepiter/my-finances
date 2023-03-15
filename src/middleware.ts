import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "./libs/auth";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;

  console.log("token", token);

  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.log(err);
    }));

  // if (!verifiedToken) {
  //   return NextResponse.rewrite(new URL("/signIn", req.url));
  // }

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
    "/history/:path*",
    "/settings/:path*",
  ],
};
