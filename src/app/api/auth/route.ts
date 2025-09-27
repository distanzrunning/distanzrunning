// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const STAGING_PASSWORD = process.env.STAGING_PASSWORD || 'distanz2025'
const SECRET_KEY = process.env.AUTH_SECRET || 'fallback-secret-key-change-in-production'

// Function to create signed cookie value
function createSignedCookie(value: string): string {
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(value)
    .digest('hex')
  return `${value}.${signature}`
}

// Function to verify signed cookie
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
    console.log('Cookie verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Auth API called')
    const { password } = await request.json()
    console.log('Password received:', password ? 'Yes' : 'No')

    if (password === STAGING_PASSWORD) {
      console.log('Password matches, creating signed cookie')
      
      // Create signed cookie value
      const signedValue = createSignedCookie('authenticated')
      
      const response = NextResponse.json({ success: true })
      
      // Set signed authentication cookie
      response.cookies.set('staging-auth', signedValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours
      })

      console.log('Signed cookie set successfully')
      return response
    } else {
      console.log('Password mismatch')
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid password'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

// Helper function to check authentication (can be used in middleware)
export function isAuthenticated(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  return verifySignedCookie(cookieValue)
}

// Optional: Add a GET endpoint to check auth status
export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get('staging-auth')?.value
  const authenticated = isAuthenticated(cookieValue)
  
  return NextResponse.json({ authenticated })
}