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
   if (session.error &&session.error === "TokenExpiredError") {
     const url = req.nextUrl.clone();
     const { pathname, origin } = url;
   //  if (url.pathname == "/") {
       return NextResponse.rewrite(`${origin}/signIn`);
   //  }
   }
  return NextResponse.next();
}
