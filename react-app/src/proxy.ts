import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["el", "en"] as const;
const DEFAULT_LOCALE = "el";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return;
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|assets|api|.*\\..*).*)"],
};
