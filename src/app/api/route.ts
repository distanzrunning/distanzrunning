// src/app/api/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'x-robots-tag': 'noindex', // This might help with the Vercel toolbar check
    },
  })
}

// Optionally handle GET requests too
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString() 
  }, {
    headers: {
      'x-robots-tag': 'noindex',
    }
  })
}