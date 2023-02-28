import { getSession } from "next-auth/react";

import { NextResponse } from "next/server";
export async function middleware(req) {
  const requestForNextAuth = {
    headers: {
      cookie: req.headers.get("cookie"),
    },
  };
  const session = await getSession({ req: requestForNextAuth });

  console.log("session", session);
   if (session?.error != undefined && session.error === "TokenExpiredError") {
     const url = req.nextUrl.clone();
     const { pathname, origin } = url;

    if (["/dashboard", "/debt"].includes(url.pathname)) {
      return NextResponse.redirect(`${origin}/signIn`);
    }
   }
  return NextResponse.next();
}
