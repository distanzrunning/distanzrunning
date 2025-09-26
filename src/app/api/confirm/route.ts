// app/api/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (!token || !email) {
    return NextResponse.json(
      { error: 'Invalid confirmation link' },
      { status: 400 }
    )
  }

  try {
    // Get subscriber from mailing list to verify token
    const getResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/lists/newsletter@${process.env.MAILGUN_DOMAIN}/members/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
        }
      }
    )

    if (!getResponse.ok) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    const subscriber = await getResponse.json()
    const storedToken = subscriber.member.vars?.confirmation_token

    // Verify token matches
    if (storedToken !== token) {
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 400 }
      )
    }

    // Check if already confirmed
    if (subscriber.member.subscribed) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirmed?already=true`)
    }

    // Update subscriber to confirmed
    const updateResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/lists/newsletter@${process.env.MAILGUN_DOMAIN}/members/${encodeURIComponent(email)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          subscribed: 'yes',
          vars: JSON.stringify({
            ...subscriber.member.vars,
            confirmed_date: new Date().toISOString(),
            confirmation_token: null // Remove token after use
          })
        })
      }
    )

    if (updateResponse.ok) {
      // Redirect to success page (no welcome email sent)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirmed`)
    } else {
      return NextResponse.json(
        { error: 'Failed to confirm subscription' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Confirmation error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}