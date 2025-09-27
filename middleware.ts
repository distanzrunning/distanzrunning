// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const SECRET_KEY = process.env.AUTH_SECRET || 'fallback-secret-key-change-in-production'

// Function to verify signed cookie (same as in auth route)
function verifySignedCookie(signedValue: string): boolean {
  try {
    const [value, signature] = signedValue.split('.')
    if (!value || !signature) return false
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(value)
      .digest('hex')
    
    // Use crypto.timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    
    if (signatureBuffer.length !== expectedBuffer.length) return false
    
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer) && value === 'authenticated'
  } catch (error) {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Only run on staging domain
  const hostname = request.headers.get('host') || ''
  const isStagingDomain = hostname === 'distanzrunning.vercel.app'
  
  if (!isStagingDomain) {
    return NextResponse.next()
  }

  // Allow auth API and login page
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Check for signed authentication cookie
  const authCookie = request.cookies.get('staging-auth')?.value
  
  if (!authCookie || !verifySignedCookie(authCookie)) {
    // Redirect to login if not authenticated or invalid signature
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
     * - images/ (your static images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}