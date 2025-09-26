// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.hostname)
  
  // Only protect staging domain
  const isStagingDomain = request.nextUrl.hostname === 'distanzrunning.vercel.app'
  console.log('Is staging domain?', isStagingDomain)
  
  if (!isStagingDomain) {
    console.log('Not staging domain, allowing through')
    return NextResponse.next()
  }

  // Skip password check for login page and API routes
  if (request.nextUrl.pathname === '/login' || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/_next/')) {
    console.log('Skipping auth for:', request.nextUrl.pathname)
    return NextResponse.next()
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get('staging-auth')
  console.log('Auth cookie:', authCookie?.value)
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    console.log('No auth cookie, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('Auth cookie valid, allowing through')
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}