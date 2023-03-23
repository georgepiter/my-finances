import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  if (req.nextUrl.pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
    return NextResponse.rewrite(new URL("/dashboard", req.url));
  } 
  return NextResponse.next();
}

