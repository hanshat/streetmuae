import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { AUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: AUTH_SECRET });

  const protectedPaths = [
    "/playlist/liked-songs",
    "/playlist/user-playlist",
    "/api/users",
  ];

  const userPaths = [
    `/api/users/${token?.sub}`,
    "/api/users/public-playlist",
    "/playlist/liked-songs",
    "/playlist/user-playlist",
    "/playlist",
  ];

  if (!token) {
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      if (pathname.startsWith("/api/users")) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (!userPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.json(
        { error: "You do not have access" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/playlist/:path*", "/api/users/:path*"],
};
