import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/role";

const publicRoutes = ["/", "/login", "/register"];

const getSession = async (request: NextRequest) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
          origin: request.nextUrl.origin,
        },
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};

// ✅ Export as default
export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublic =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/listings") ||
    pathname.startsWith("/orders");

  const session = await getSession(request);
  const role = session?.user?.role ?? null;

  // Not logged in → redirect to login
  if (!role && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in + trying to access auth pages → redirect to dashboard
  if (role && (pathname === "/login" || pathname === "/register")) {
    if (role === Roles.FARMER) {
      return NextResponse.redirect(new URL("/farmer/listings", request.url));
    }
    if (role === Roles.BUYER) {
      return NextResponse.redirect(new URL("/buyer/orders", request.url));
    }
    if (role === Roles.ADMIN) {
      return NextResponse.redirect(new URL("/admin/analytics", request.url));
    }
  }

  // Role-based access control
  if (role === Roles.FARMER) {
    if (pathname.startsWith("/buyer") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/farmer/listings", request.url));
    }
  }

  if (role === Roles.BUYER) {
    if (pathname.startsWith("/farmer") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/buyer/orders", request.url));
    }
  }

  if (role === Roles.ADMIN) {
    if (pathname.startsWith("/farmer") || pathname.startsWith("/buyer")) {
      return NextResponse.redirect(new URL("/admin/analytics", request.url));
    }
  }

  return NextResponse.next();
}

// Config for matcher
export const config = {
  matcher: [
    "/farmer/:path*",
    "/buyer/:path*",
    "/admin/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
