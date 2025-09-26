// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// Use edge runtime for better performance
export const runtime = 'edge'

export function middleware(request: NextRequest) {
  // Add comprehensive logging to verify execution
  console.log('Middleware executing for:', request.nextUrl.href)
  console.log('Hostname:', request.nextUrl.hostname)
  console.log('Pathname:', request.nextUrl.pathname)
  console.log('User-Agent:', request.headers.get('user-agent'))
  
  const isStagingDomain = request.nextUrl.hostname === 'distanzrunning.vercel.app'
  console.log('Is staging domain?', isStagingDomain)
  
  if (!isStagingDomain) {
    console.log('Not staging domain, allowing through')
    return NextResponse.next()
  }

  // Skip auth for login, API routes, and static assets
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname === '/favicon.ico' ||
      request.nextUrl.pathname.startsWith('/images/')) {
    console.log('Skipping auth for protected path:', request.nextUrl.pathname)
    return NextResponse.next()
  }

  // Check auth cookie
  const authCookie = request.cookies.get('staging-auth')
  console.log('Auth cookie exists:', !!authCookie)
  console.log('Auth cookie value:', authCookie?.value)
  console.log('All cookies:', request.cookies.getAll())
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    console.log('No valid auth cookie found, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    console.log('Redirect URL:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  console.log('Auth cookie valid, allowing through')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}