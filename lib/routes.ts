export const publicRoutes = ["/", "/signup"] as const

export const protectedRoutes = ["/dashboard", "/expenses"] as const

export type PublicRoute = (typeof publicRoutes)[number]
export type ProtectedRoute = (typeof protectedRoutes)[number]

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}
