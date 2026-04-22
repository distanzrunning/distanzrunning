// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

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
    const { email, recaptchaToken } = await request.json()

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

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

      if (recaptchaSecretKey) {
        const recaptchaResponse = await fetch(
          `https://www.google.com/recaptcha/api/siteverify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              secret: recaptchaSecretKey,
              response: recaptchaToken,
            }),
          }
        )

        const recaptchaData = await recaptchaResponse.json()

        if (!recaptchaData.success || recaptchaData.score < 0.5) {
          return NextResponse.json(
            { error: 'reCAPTCHA verification failed. Please try again.' },
            { status: 400 }
          )
        }
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex')

    // Step 1: Add subscriber to Mailgun mailing list (unconfirmed)
    const listResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/lists/newsletter@${process.env.MAILGUN_DOMAIN}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          address: email,
          subscribed: 'no', // Start as unconfirmed
          upsert: 'yes', // Update if already exists
          vars: JSON.stringify({
            confirmation_token: confirmationToken,
            signup_date: new Date().toISOString(),
            source: 'website'
          })
        })
      }
    )

    const listData = await listResponse.json()

    if (!listResponse.ok) {
      // Handle Mailgun list errors
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (listData.message && listData.message.includes('already exists')) {
        errorMessage = 'You are already subscribed to our newsletter.'
      } else if (listData.message) {
        errorMessage = listData.message
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Step 2: Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://distanzrunning.vercel.app'
    const confirmationUrl = `${baseUrl}/api/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`
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

    // Multipart form so we can attach the inline brand assets. Each
    // `inline` part becomes a cid: reference matching the filename.
    const emailForm = new FormData()
    emailForm.append('from', `Distanz Running <newsletter@${process.env.MAILGUN_DOMAIN}>`)
    emailForm.append('to', email)
    emailForm.append('subject', 'Please confirm your subscription to Distanz Running')
    emailForm.append('html', confirmationHtml)
    emailForm.append('o:tag', 'confirmation-email')
    emailForm.append('o:tracking', 'yes')
    emailForm.append('o:tracking-clicks', 'no')
    emailForm.append(
      'inline',
      new Blob([new Uint8Array(ICON_BUFFER)], { type: 'image/png' }),
      'icon-badge.png',
    )
    emailForm.append(
      'inline',
      new Blob([new Uint8Array(WORDMARK_GRAY_BUFFER)], { type: 'image/png' }),
      'wordmark-gray.png',
    )

    const emailResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          // No Content-Type — fetch sets multipart/form-data with the
          // correct boundary automatically when the body is a FormData.
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
        },
        body: emailForm,
      }
    )

    const emailData = await emailResponse.json()

    if (emailResponse.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Please check your email to confirm your subscription!' 
      })
    } else {
      console.error('Email send error:', emailData)
      return NextResponse.json(
        { error: 'Subscription added but confirmation email failed. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Network error. Please try again later.' },
      { status: 500 }
    )
  }
}