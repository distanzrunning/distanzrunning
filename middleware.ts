// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

const SECRET_KEY = process.env.AUTH_SECRET || 'fallback-secret-key-change-in-production'

// Function to verify signed cookie (same as in route.ts)
function verifySignedCookie(signedValue: string): boolean {
  try {
    const parts = signedValue.split('.')
    if (parts.length !== 2) return false
    
    const [value, signature] = parts
    if (!value || !signature || value !== 'authenticated') return false
    
    // Validate signature format (should be 64 hex characters)
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(value)
      .digest('hex')
    
    // Use crypto.timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    
    if (signatureBuffer.length !== expectedBuffer.length) return false
    
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  } catch (error) {
    console.log('🔍 Cookie verification error:', error)
    return false
  }
}

export function middleware(request: NextRequest) {
  const timestamp = new Date().toISOString()
  console.log(`🚀 [${timestamp}] MIDDLEWARE EXECUTING FOR:`, request.nextUrl.pathname)
  console.log(`🌐 [${timestamp}] HOST:`, request.headers.get('host'))
  console.log(`📝 [${timestamp}] METHOD:`, request.method)
  console.log(`🔗 [${timestamp}] USER-AGENT:`, request.headers.get('user-agent')?.substring(0, 50))
  
  // Create response object early to add CORS headers
  let response = NextResponse.next()
  
  // Add CORS headers (moved from next.config.ts)
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    console.log(`✈️ [${timestamp}] Handling OPTIONS preflight request`)
    return response
  }
  
  // Only run authentication on staging domain
  const hostname = request.headers.get('host') || ''
  if (hostname !== 'distanzrunning.vercel.app') {
    console.log(`❌ [${timestamp}] Not staging domain (${hostname}), skipping auth`)
    return response
  }

  console.log(`🎯 [${timestamp}] On staging domain - checking authentication`)

  // Skip login and API routes
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`✅ [${timestamp}] Allowing login/api path:`, request.nextUrl.pathname)
    return response
  }

  // Skip static assets more thoroughly
  if (request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.startsWith('/favicon') ||
      request.nextUrl.pathname.includes('.')) {
    console.log(`📁 [${timestamp}] Skipping static asset:`, request.nextUrl.pathname)
    return response
  }

  // Check authentication
  const cookieValue = request.cookies.get('staging-auth')?.value
  console.log(`🍪 [${timestamp}] Cookie present:`, cookieValue ? 'Yes' : 'No')
  
  if (cookieValue) {
    console.log(`🔍 [${timestamp}] Cookie value length:`, cookieValue.length)
    console.log(`🔍 [${timestamp}] Cookie starts with:`, cookieValue.substring(0, 20) + '...')
    
    if (verifySignedCookie(cookieValue)) {
      console.log(`✅ [${timestamp}] Valid authentication cookie found - ALLOWING ACCESS`)
      return response
    } else {
      console.log(`❌ [${timestamp}] Invalid cookie signature - REJECTING`)
    }
  } else {
    console.log(`❌ [${timestamp}] No authentication cookie found`)
  }

  // Invalid or missing authentication - redirect to login
  console.log(`🔒 [${timestamp}] REDIRECTING TO LOGIN - No valid auth`)
  const loginUrl = new URL('/login', request.url)
  console.log(`🔀 [${timestamp}] Redirect URL:`, loginUrl.toString())
  
  const redirectResponse = NextResponse.redirect(loginUrl)
  
  // Add CORS headers to redirect response too
  redirectResponse.headers.set('Access-Control-Allow-Origin', '*')
  redirectResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  redirectResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  return redirectResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * Feel free to modify this list based on your static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api).*)',
  ],
}// Force rebuild Sat 27 Sep 2025 22:40:50 CEST
