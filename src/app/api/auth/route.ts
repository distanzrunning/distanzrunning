// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'

const STAGING_PASSWORD = process.env.STAGING_PASSWORD || 'distanz2025'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === STAGING_PASSWORD) {
      const response = NextResponse.json({ success: true })
      
      // Set authentication cookie for 24 hours
      response.cookies.set('staging-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })

      return response
    } else {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}