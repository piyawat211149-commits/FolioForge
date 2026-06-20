import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const dashboardPattern = /^\/dashboard/
  const authPattern = /^\/(login|register|verify-email)/

  if (dashboardPattern.test(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (authPattern.test(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
}
