// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect staging domain
  const isStagingDomain = request.nextUrl.hostname === 'distanzrunning.vercel.app'
  
  if (!isStagingDomain) {
    return NextResponse.next()
  }

  // Skip password check for login page and API routes
  if (request.nextUrl.pathname === '/login' || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get('staging-auth')
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}