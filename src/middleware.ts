import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get tokens and role from cookies
  const accessToken = request.cookies.get('access_token')?.value
  const userRole = request.cookies.get('user_role')?.value?.toLowerCase()

  // 2. Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // If no token or role is not admin/vendor, redirect to home
    if (!accessToken || (userRole !== 'admin' && userRole !== 'vendor')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. Optional: Redirect authenticated users away from /auth pages
  if (pathname.startsWith('/auth') && pathname !== '/auth/logout') {
    if (accessToken) {
        // If they are admin/vendor, they should stay in /admin, else /
        if (userRole === 'admin' || userRole === 'vendor') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Matches /admin and /admin/* and /auth/* but skips static files, images, and _next internals
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/auth/:path*',
  ],
}
