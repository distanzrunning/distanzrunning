// middleware.ts (place this in your project root, same level as package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests first
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  const hostname = request.headers.get('host') || ''
  
  // Only check authentication on staging domain
  if (hostname !== 'distanzrunning.vercel.app') {
    return NextResponse.next()
  }

  // Get the authentication cookie
  const authCookie = request.cookies.get('staging-auth')
  const isAuthenticated = authCookie?.value === 'authenticated'
  const pathname = request.nextUrl.pathname

  // Allow access to login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated (but since you're using client-side auth, this is optional)
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}