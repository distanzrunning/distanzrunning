// app/api/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyConfirmToken } from '@/lib/newsletterConfirmToken'

// Second half of the stateless double opt-in: the signed token from
// /api/subscribe is the only pending state — a Resend contact is
// created (or re-subscribed) HERE, never at signup time.

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Invalid confirmation link' },
      { status: 400 }
    )
  }

  const resendKey = process.env.RESEND_API_KEY
  const confirmSecret = process.env.NEWSLETTER_CONFIRM_SECRET
  if (!resendKey || !confirmSecret) {
    console.error('Confirm: RESEND_API_KEY / NEWSLETTER_CONFIRM_SECRET not set')
    return NextResponse.json(
      { error: 'Newsletter signups are temporarily unavailable.' },
      { status: 503 }
    )
  }

  const email = verifyConfirmToken(token, confirmSecret)
  if (!email) {
    return NextResponse.json(
      { error: 'This confirmation link is invalid or has expired. Please subscribe again.' },
      { status: 400 }
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // GET-then-create/patch: Resend's duplicate-create behaviour is
    // undocumented, so never blind-create over an existing contact.
    const getRes = await fetch(
      `https://api.resend.com/contacts/${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${resendKey}` },
      }
    )

    if (getRes.ok) {
      const contact = await getRes.json()
      if (contact.unsubscribed) {
        // Previously unsubscribed reader confirming again — re-subscribe.
        const patchRes = await fetch(
          `https://api.resend.com/contacts/${encodeURIComponent(email)}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ unsubscribed: false }),
          }
        )
        if (patchRes.ok) {
          return NextResponse.redirect(`${baseUrl}/confirmed`)
        }
        console.error(
          'Resend contact patch error:',
          patchRes.status,
          await patchRes.text().catch(() => '')
        )
        return NextResponse.json(
          { error: 'Failed to confirm subscription' },
          { status: 500 }
        )
      }
      // Already a subscribed contact — nothing to write.
      return NextResponse.redirect(`${baseUrl}/confirmed?already=true`)
    }

    // No contact yet — this is the moment the subscription actually
    // comes into existence.
    const createRes = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    })

    if (createRes.ok) {
      return NextResponse.redirect(`${baseUrl}/confirmed`)
    }

    console.error(
      'Resend contact create error:',
      createRes.status,
      await createRes.text().catch(() => '')
    )
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Confirmation error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
