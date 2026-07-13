// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { createConfirmToken } from '@/lib/newsletterConfirmToken'

// Brand assets ride inside each confirmation email as inline (cid:)
// attachments rather than externally hosted images, so they render
// with the body text in every email client — including Outlook desktop,
// where remote images often paint late or get blocked. PNGs (not SVGs)
// because Outlook's Word-based renderer doesn't reliably handle SVG.
// Read once at module load — the files are static.
const BRAND_DIR = path.join(process.cwd(), 'public/brand')
const ICON_BUFFER = fs.readFileSync(path.join(BRAND_DIR, 'icon-badge.png'))
const WORDMARK_GRAY_BUFFER = fs.readFileSync(path.join(BRAND_DIR, 'wordmark-gray.png'))

export async function POST(request: NextRequest) {
  try {
    const { email, turnstileToken } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Verify the Cloudflare Turnstile token. Verification is REQUIRED
    // whenever the secret is configured — a tokenless submit is
    // rejected (the old reCAPTCHA flow only verified when a token
    // happened to arrive, which bots could simply omit). Without the
    // secret (dev, pre-key deploys) the check is skipped entirely.
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
      const failed = NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      )
      if (!turnstileToken || typeof turnstileToken !== 'string') {
        return failed
      }
      const verifyResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        }
      )
      const verifyData = await verifyResponse.json()
      if (!verifyData.success) {
        return failed
      }
    }

    // Stateless double opt-in (Resend). No contact is read or written
    // here — the email travels inside a signed, expiring token, and a
    // Resend contact only comes into existence when /api/confirm
    // verifies it. Re-subscribing an existing (even confirmed) address
    // therefore only ever re-sends a confirmation email, which makes
    // the old Mailgun bug — the update-if-exists write flipping
    // confirmed members back to unconfirmed — structurally impossible.
    const resendKey = process.env.RESEND_API_KEY
    const confirmSecret = process.env.NEWSLETTER_CONFIRM_SECRET
    if (!resendKey || !confirmSecret) {
      console.error('Subscribe: RESEND_API_KEY / NEWSLETTER_CONFIRM_SECRET not set')
      return NextResponse.json(
        { error: 'Newsletter signups are temporarily unavailable.' },
        { status: 503 }
      )
    }

    // One canonical address for the token and the send — the token
    // helper normalises identically, so the confirmed contact matches.
    const normalised = email.trim().toLowerCase()

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://distanzrunning.vercel.app'
    const confirmationUrl = `${baseUrl}/api/confirm?token=${createConfirmToken(normalised, confirmSecret)}`
    const currentYear = new Date().getFullYear()

    // Tokens are resolved to hex because email clients don't support
    // CSS variables. Fonts use the system stack — Geist + EB Garamond
    // don't load reliably across clients (Outlook desktop strips
    // @import entirely), so we lean on the design-system fallbacks
    // (Georgia for serif headings, system sans for body) which are
    // present on every device.
    const confirmationHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Confirm your subscription · Distanz Running</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
          table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
          img { -ms-interpolation-mode:bicubic; border:0; line-height:100%; outline:none; text-decoration:none; }
          body { margin:0 !important; padding:0 !important; width:100% !important; }
          @media only screen and (max-width: 600px) {
            .heading { font-size:28px !important; }
            .main-section { padding:40px 24px !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#FAFAFA;color:#171717;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#FAFAFA;">
          <tr>
            <td align="center" style="padding:32px 16px;">

              <!-- Card -->
              <table role="presentation" class="container" width="560" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#FFFFFF;border-radius:12px;">
                <tr>
                  <td class="main-section" style="padding:48px 40px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">

                      <!-- Brand mark -->
                      <tr>
                        <td style="padding:0 0 32px 0;">
                          <a href="https://distanzrunning.com" style="text-decoration:none;display:inline-block;">
                            <img
                              src="cid:icon-badge.png"
                              alt="Distanz Running"
                              width="36"
                              height="36"
                              style="display:block;width:36px;height:36px;border:0;" />
                          </a>
                        </td>
                      </tr>

                      <!-- Heading -->
                      <tr>
                        <td style="padding:0 0 16px 0;">
                          <h1 class="heading" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;font-weight:500;color:#171717;">
                            Welcome to the <i style="font-style:italic;">Shakeout</i>
                          </h1>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:0 0 32px 0;">
                          <p style="margin:0;font-size:16px;line-height:1.55;color:#171717;">
                            One last step — confirm your email to start receiving the Shakeout.
                          </p>
                        </td>
                      </tr>

                      <!-- CTA: auto-width, left-aligned to match the
                           single-action editorial pattern from the
                           reference emails. -->
                      <tr>
                        <td>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td bgcolor="#171717" style="border-radius:6px;background-color:#171717;">
                                <a href="${confirmationUrl}" target="_blank" style="display:inline-block;padding:14px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.2;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:6px;">
                                  Confirm your email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer (sits on the canvas, outside the card) -->
              <table role="presentation" width="560" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
                <tr>
                  <td align="center" style="padding:32px 16px 12px 16px;text-align:center;">
                    <img
                      src="cid:wordmark-gray.png"
                      alt="Distanz Running"
                      width="100"
                      height="31"
                      style="display:block;margin:0 auto;width:100px;height:31px;border:0;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 16px;text-align:center;">
                    <p style="margin:0 0 6px 0;font-size:13px;line-height:1.4;color:#171717;font-weight:500;">
                      Running stories, gear, races.
                    </p>
                    <p style="margin:0;font-size:13px;line-height:1.4;color:#8F8F8F;">
                      © ${currentYear} Distanz Running. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
    `

    // Resend send — raw fetch, no SDK (repo convention). Inline brand
    // assets go as base64 attachments whose content_id matches the
    // cid: references in the template.
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Distanz Running <newsletter@distanzrunning.com>',
        to: normalised,
        subject: 'Please confirm your subscription to Distanz Running',
        html: confirmationHtml,
        tags: [{ name: 'type', value: 'confirmation-email' }],
        attachments: [
          {
            filename: 'icon-badge.png',
            content: ICON_BUFFER.toString('base64'),
            content_type: 'image/png',
            content_id: 'icon-badge.png',
          },
          {
            filename: 'wordmark-gray.png',
            content: WORDMARK_GRAY_BUFFER.toString('base64'),
            content_type: 'image/png',
            content_id: 'wordmark-gray.png',
          },
        ],
      }),
    })

    if (!emailResponse.ok) {
      // Log the provider body server-side only — reflecting it into the
      // JSON error was the old information-leak bug.
      console.error(
        'Resend send error:',
        emailResponse.status,
        await emailResponse.text().catch(() => '')
      )
      return NextResponse.json(
        { error: 'We could not send the confirmation email. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription!'
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Network error. Please try again later.' },
      { status: 500 }
    )
  }
}
