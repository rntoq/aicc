import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/test"];

const AUTH_ROUTES = ["/login", "/register"];

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/** Декодирует JWT и проверяет истёк ли он (без обращения к серверу) */
function isJwtExpired(token: string): boolean {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return true;
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Игнорируем системные файлы
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  const hasValidAccess = !!accessToken && !isJwtExpired(accessToken);
  // Если access истёк, но refresh есть — пользователь ещё может авторизоваться
  const hasAnyAuth = hasValidAccess || !!refreshToken;

  // ❌ Нет ни токена, ни refresh — приватная страница
  if (!hasAnyAuth && !isPublic(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Только с валидным (не истёкшим) access токеном редиректим с login/register
  if (hasValidAccess && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
