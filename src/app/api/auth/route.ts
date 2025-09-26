// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'

const STAGING_PASSWORD = process.env.STAGING_PASSWORD || 'distanz2025'

export async function POST(request: NextRequest) {
  try {
    console.log('Auth API called')
    const { password } = await request.json()
    console.log('Password received:', password ? 'Yes' : 'No')
    console.log('Expected password:', STAGING_PASSWORD)
    console.log('Password match:', password === STAGING_PASSWORD)

    if (password === STAGING_PASSWORD) {
      console.log('Password matches, setting cookie')
      const response = NextResponse.json({ success: true })
      
      // Set authentication cookie with explicit path
      response.cookies.set('staging-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', // Explicit path
        maxAge: 24 * 60 * 60, // 24 hours
      })

      console.log('Cookie set successfully')
      return response
    } else {
      console.log('Password mismatch')
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid password',
        debug: {
          receivedLength: password?.length,
          expectedLength: STAGING_PASSWORD.length,
          expected: STAGING_PASSWORD.substring(0, 3) + '...'
        }
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}