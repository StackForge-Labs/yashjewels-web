import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get tokens and role from cookies
  const accessToken = request.cookies.get('access_token')?.value
  const userRole = request.cookies.get('user_role')?.value?.toLowerCase()

  // Helper to determine home dashboard based on role
  const getHomeUrl = (role?: string) => {
    if (role === 'admin') return '/admin'
    if (role === 'vendor') return '/vendor'
    if (role === 'shipper') return '/shipper'
    return '/'
  }

  // 2. Protect /admin routes (Admin ONLY)
  if (pathname.startsWith('/admin')) {
    if (!accessToken || userRole !== 'admin') {
      return NextResponse.redirect(new URL(getHomeUrl(userRole), request.url))
    }
  }

  // 3. Protect /vendor routes (Vendor or Admin)
  if (pathname.startsWith('/vendor')) {
    if (!accessToken || (userRole !== 'vendor' && userRole !== 'admin')) {
      return NextResponse.redirect(new URL(getHomeUrl(userRole), request.url))
    }
  }

  // 4. Protect /shipper routes (Shipper or Admin)
  if (pathname.startsWith('/shipper')) {
    if (!accessToken || (userRole !== 'shipper' && userRole !== 'admin')) {
      return NextResponse.redirect(new URL(getHomeUrl(userRole), request.url))
    }
  }

  // 5. Redirect authenticated users away from /auth pages (except KYC/Logout)
  if (pathname.startsWith('/auth') && pathname !== '/auth/logout' && !pathname.startsWith('/auth/kyc')) {
    if (accessToken) {
        return NextResponse.redirect(new URL(getHomeUrl(userRole), request.url))
    }
  }

  return NextResponse.next()
}

// Matches /admin and /admin/* and /auth/* but skips static files, images, and _next internals
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
    '/shipper/:path*',
    '/auth/:path*',
  ],
}
