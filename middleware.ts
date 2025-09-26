// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle OPTIONS requests (CORS preflight)
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

  // Get the pathname and check if it's a staging domain
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Check if this is a staging domain (vercel.app domains)
  const isStaging = hostname.includes('.vercel.app') || 
                    hostname.includes('staging') || 
                    process.env.NODE_ENV === 'development'

  // If it's staging and not already on login page, check for auth
  if (isStaging && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/api/auth')) {
    const authCookie = request.cookies.get('staging-auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Continue with the request
  const response = NextResponse.next()
  
  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}