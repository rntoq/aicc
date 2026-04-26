import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Не обрабатываем системные и статические файлы.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Единственное правило: /client* доступен только с токенами.
  const isClientRoute = pathname === "/client" || pathname.startsWith("/client/");
  const hasAccess = !!request.cookies.get("access")?.value;
  const hasRefresh = !!request.cookies.get("refresh")?.value;

  if (isClientRoute && !hasAccess && !hasRefresh) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
