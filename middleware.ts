// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚀 MIDDLEWARE EXECUTING FOR:', request.nextUrl.pathname)
  console.log('🌐 HOST:', request.headers.get('host'))
  
  // Only run on staging domain
  const hostname = request.headers.get('host') || ''
  if (hostname !== 'distanzrunning.vercel.app') {
    console.log('❌ Not staging domain, skipping')
    return NextResponse.next()
  }

  // Skip login and API routes
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api/')) {
    console.log('✅ Allowing login/api path')
    return NextResponse.next()
  }

  // For testing: always redirect to login for now
  console.log('🔒 REDIRECTING TO LOGIN FOR TEST')
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}