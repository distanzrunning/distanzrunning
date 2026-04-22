// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

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
    
    const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Confirm Your Subscription - Distanz Running</title>
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
          /* Import Inter font */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Reset and base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: #37383f;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            width: 100%;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          /* Email container */
          .email-container {
            width: 100%;
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
          }

          /* Content padding */
          .content-cell {
            padding: 24px 16px 0 16px;
          }

          /* Header with icon and text */
          .header-row {
            padding: 40px 0 24px 0;
          }

          .icon-cell {
            width: 36px;
            vertical-align: middle;
          }

          .header-text-cell {
            vertical-align: middle;
            text-align: right;
            padding-left: 16px;
          }

          .header-link {
            text-decoration: none;
            color: #696a6f;
            font-size: 14px;
            font-weight: 600;
          }

          /* Main heading */
          .heading {
            font-family: 'Inter', sans-serif;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.2;
            color: #23242c;
            margin: 24px 0 16px 0;
          }

          /* Body text */
          .body-text {
            font-size: 16px;
            line-height: 1.7;
            color: #37383f;
            margin-bottom: 16px;
          }

          /* Button */
          .button {
            display: inline-block;
            width: 100%;
            padding: 12px 8px;
            background-color: #05060f;
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
            letter-spacing: normal;
            line-height: 28.8px;
          }

          /* Divider */
          .divider {
            border-top: 1px solid #e6e6e7;
            margin: 48px 0;
          }

          /* Footer icon */
          .footer-icon {
            margin-bottom: 12px;
          }

          /* Footer tagline */
          .footer-tagline {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #05060f;
            line-height: 1.2;
            margin-bottom: 24px;
          }

          /* Copyright */
          .copyright {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #696a6f;
            margin-bottom: 40px;
          }

          /* Mobile responsive */
          @media only screen and (max-width: 600px) {
            .heading {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff">
          <tr>
            <td>
              <table class="email-container" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff;max-width:560px;margin:0 auto">
                <tr>
                  <td class="content-cell" style="padding:24px 16px 0 16px">

                    <!-- Header Row: Icon only -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="header-row">
                      <tr>
                        <td style="vertical-align:middle">
                          <a href="https://distanzrunning.com" style="text-decoration:none">
                            <img
                              src="${baseUrl}/brand/icon-badge.svg"
                              alt="Distanz Running"
                              width="48"
                              height="48"
                              style="display:block;height:auto;border:0" />
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Main Content -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td>
                          <h1 class="heading" style="font-family:'Inter',sans-serif;font-size:32px;font-weight:700;line-height:1.2;color:#23242c;margin:24px 0 16px 0">Welcome to the <i style="font-style:italic">Shakeout</i></h1>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="body-text" style="font-family:'Inter',sans-serif;font-size:16px;line-height:1.7;color:#37383f;margin-bottom:16px">
                            Thank you for subscribing to our newsletter. To complete your subscription, please confirm your email address by clicking the button below.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Button -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0">
                      <tr>
                        <td align="center">
                          <a href="${confirmationUrl}" class="button" style="display:inline-block;width:100%;padding:12px 8px;background-color:#05060f;color:#ffffff;text-decoration:none;border-radius:12px;font-size:18px;font-weight:700;text-align:center;font-family:'Inter',sans-serif">
                            Confirm your subscription
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="divider" style="border-top:1px solid #e6e6e7;margin:48px 0;padding:48px 0 0 0"></td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding-bottom:12px">
                          <a href="https://distanzrunning.com" style="text-decoration:none">
                            <img
                              src="${baseUrl}/brand/logo-full-email.svg"
                              alt="Distanz Running"
                              width="120"
                              height="37"
                              style="display:block;height:auto;border:0" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="footer-tagline" style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:#05060f;line-height:1.2;margin-bottom:24px">Running stories, gear, races</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="copyright" style="font-family:'Inter',sans-serif;font-size:14px;line-height:1.5;color:#696a6f;margin-bottom:40px">
                            Copyright © 2025 Distanz Running, All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `

    const emailResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Distanz Running <newsletter@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: 'Please confirm your subscription to Distanz Running',
          html: confirmationHtml,
          'o:tag': 'confirmation-email',
          'o:tracking': 'yes',
          'o:tracking-clicks': 'no'  // This disables click tracking!
        })
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