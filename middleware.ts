import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/about", "/services", "/documents", "/faq"]

// This middleware is temporarily disabled to debug authentication issues
export function middleware(request: NextRequest) {
  // For now, allow all requests to pass through
  return NextResponse.next()

  /* Original middleware logic - commented out for debugging
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith("/api/"))

  // Get the token from cookies
  const token = request.cookies.get("accessToken")?.value || request.cookies.get("auth_token")?.value

  console.log("Middleware checking path:", path)
  console.log("Is public route:", isPublicRoute)
  console.log("Token exists:", !!token)

  // If the route is not public and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    console.log("Redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the route is login or register and there's a token, redirect to profile
  if ((path === "/login" || path === "/register") && token) {
    console.log("Redirecting to profile")
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
  */
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
