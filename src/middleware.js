import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // return NextResponse
    return NextResponse.rewrite(new URL("/admin", req.url));
  },
  {
    callbacks: {
      authorized({ token }) {
        return token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/register", "/receipt-payment", "/admin"],
};
