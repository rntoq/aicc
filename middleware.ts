import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/test"];

const AUTH_ROUTES = [
  "/login",
  "/register",
];

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  // Игнорируем системные файлы
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ❌ Нет токена и идёт на приватную страницу
  if (!accessToken && !isPublic(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Есть токен и идёт на login/register
  if (accessToken && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
