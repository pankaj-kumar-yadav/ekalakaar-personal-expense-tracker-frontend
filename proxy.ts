import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { isProtectedRoute, isPublicRoute } from "@/lib/routes"

const SESSION_COOKIE = "jwt"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)

  if (isProtectedRoute(pathname) && !hasSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isPublicRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*$).*)"],
}
