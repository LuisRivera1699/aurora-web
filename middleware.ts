import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeFromAcceptLanguage } from "@/content/getMessages";

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_HEADER = "x-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  if (pathname === "/blog") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale =
      cookieLocale === "en" || cookieLocale === "es"
        ? cookieLocale
        : localeFromAcceptLanguage(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/blog`;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (first === "es" || first === "en") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, first);
    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    res.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog", "/(es|en)/:path*"],
};
