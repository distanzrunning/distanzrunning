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
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`
    
    const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Confirm Your Subscription - Distanz Running</title>
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
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
          /* Import Distanz fonts: Montserrat (headline), Hind Madurai (body) */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Hind+Madurai:wght@400;500;600&display=swap');

          /* Reset and base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Hind Madurai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            line-height: 1.5;
            color: #1a1a1a !important;
            background-color: #f5f5f5 !important;
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          /* Gmail and client-specific fixes */
          u + #body .email-wrapper { background-color: #f5f5f5 !important; }
          u + #body .content-container { background-color: #ffffff !important; }
          
          /* Full width structure */
          .email-wrapper {
            width: 100% !important;
            background-color: #f5f5f5 !important;
            margin: 0;
            padding: 40px 16px;
          }

          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f5f5f5 !important;
          }

          .content-container {
            background-color: #ffffff !important;
            border-radius: 16px;
            margin: 0 auto;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e5e5;
          }

          /* Header section - Dark background for white logo */
          .header-section {
            background: #1a1a1a !important;
            padding: 48px 40px;
            text-align: center;
          }

          /* Logo styling - White logo on dark background */
          .logo {
            height: 56px;
            width: auto;
            display: block;
            margin: 0 auto;
            max-width: 100%;
          }
          
          /* Content section */
          .content-section {
            background-color: #ffffff !important;
            padding: 40px;
          }

          /* Typography - Distanz design system */
          .greeting {
            font-family: 'Montserrat', sans-serif !important;
            color: #1a1a1a !important;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            text-align: left;
            letter-spacing: -0.02em;
          }

          .intro-text {
            font-family: 'Hind Madurai', sans-serif !important;
            color: #525252 !important;
            font-size: 17px;
            font-weight: 400;
            line-height: 1.5;
            margin-bottom: 16px;
            text-align: left;
          }

          .instruction-text {
            font-family: 'Hind Madurai', sans-serif !important;
            color: #1a1a1a !important;
            font-size: 17px;
            font-weight: 500;
            line-height: 1.5;
            margin-bottom: 28px;
            text-align: left;
          }
          
          /* Button styling - matches design system */
          .button-container {
            text-align: left;
            margin: 32px 0 24px 0;
          }

          .button {
            display: inline-block !important;
            padding: 16px 32px !important;
            background: #1a1a1a !important;
            color: #ffffff !important;
            text-decoration: none !important;
            border-radius: 8px;
            font-weight: 600;
            font-family: 'Hind Madurai', sans-serif !important;
            font-size: 16px;
            line-height: 1;
            border: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
            text-align: center;
          }
          
          /* Footer */
          .footer-section {
            background-color: #f5f5f5 !important;
            padding: 32px 20px 20px 20px;
            text-align: center;
          }

          /* Social links - simple styling */
          .social-links {
            margin-bottom: 24px;
            background-color: #f5f5f5 !important;
          }

          .social-links table {
            margin: 0 auto;
            background-color: #f5f5f5 !important;
          }

          .social-links td {
            padding: 0 8px;
            background-color: #f5f5f5 !important;
          }
          
          .social-links a {
            display: inline-block;
            padding: 8px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.05) !important;
            text-decoration: none;
            width: 36px;
            height: 36px;
            text-align: center;
          }
          
          /* Company info */
          .company-info {
            font-size: 14px;
            color: #666666 !important;
            font-family: 'Hind Madurai', sans-serif !important;
            margin-bottom: 16px;
            line-height: 1.5;
          }

          .company-info p {
            margin-bottom: 4px;
            text-align: center;
            color: #666666 !important;
          }

          .company-name {
            font-weight: 600;
            color: #1a1a1a !important;
          }
          
          /* Mobile responsive */
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              padding: 24px 12px !important;
            }
            .header-section {
              padding: 32px 24px 24px 24px !important;
            }
            .content-section {
              padding: 32px 24px !important;
            }
            .greeting {
              font-size: 22px !important;
            }
            .button {
              padding: 16px 28px !important;
              font-size: 15px !important;
              width: 100%;
              text-align: center;
            }
            .button-container {
              text-align: center;
            }
          }
        </style>
      </head>
      <body id="body">
        <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5 !important;">
          <tr>
            <td align="center" style="background-color: #f5f5f5 !important;">
              <div class="email-container">
                <div class="content-container" style="background-color: #ffffff !important;">
                  
                  <!-- Header with logo -->
                  <div class="header-section" style="background-color: #1a1a1a !important;">
                    <img
                      src="https://distanzrunning.com/images/logo_white.svg"
                      alt="Distanz Running"
                      class="logo"
                      width="200"
                      height="56"
                      style="height: 56px; width: auto; display: block; margin: 0 auto;"
                    />
                  </div>
                  
                  <!-- Content -->
                  <div class="content-section" style="background-color: #ffffff !important;">
                    <h1 class="greeting">Welcome to Distanz Running!</h1>
                    
                    <p class="intro-text">
                      Thank you for subscribing to our newsletter. We will keep you updated on our progress to bring you comprehensive running content, gear reviews, and interactive race guides.
                    </p>
                    
                    <p class="instruction-text">
                      To complete your subscription, please confirm your email address:
                    </p>
                    
                    <div class="button-container">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${confirmationUrl}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="17%" stroke="f" fillcolor="#1a1a1a">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:'Hind Madurai',sans-serif;font-size:16px;font-weight:600;">Confirm Your Email</center>
                      </v:roundrect>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <a href="${confirmationUrl}" class="button" style="background: #1a1a1a !important; color: #ffffff !important; text-decoration: none !important; display: inline-block; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-family: 'Hind Madurai', sans-serif; font-size: 16px;">Confirm Your Email</a>
                      <!--<![endif]-->
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="footer-section" style="background-color: #f5f5f5 !important;">
                  <!-- Social links using the exact same code as your original working version -->
                  <div class="social-links" style="background-color: #f5f5f5 !important;">
                    <table cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5 !important;">
                      <tr>
                        <td style="background-color: #f5f5f5 !important;">
                          <a href="https://x.com/DistanzRunning"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X / Twitter"
                            style="display: inline-block; padding: 8px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.05) !important; text-decoration: none; width: 36px; height: 36px; text-align: center;">
                            <img
                              src="https://res.cloudinary.com/dbzirtpem/image/upload/v1757799203/x_40_40.png"
                              alt="X / Twitter"
                              width="20"
                              height="20"
                              style="display: block; border: 0; outline: none; text-decoration: none; margin: auto;" />
                          </a>
                        </td>

                        <td style="background-color: #f5f5f5 !important;">
                          <a href="https://www.linkedin.com/company/distanz-running"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            style="display: inline-block; padding: 8px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.05) !important; text-decoration: none; width: 36px; height: 36px; text-align: center;">
                            <img
                              src="https://res.cloudinary.com/dbzirtpem/image/upload/v1757799149/linkedin_40_40.png"
                              alt="LinkedIn"
                              width="20"
                              height="20"
                              style="display: block; border: 0; outline: none; text-decoration: none; margin: auto;" />
                          </a>
                        </td>

                        <td style="background-color: #f5f5f5 !important;">
                          <a href="https://www.instagram.com/distanzrunning/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            style="display: inline-block; padding: 8px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.05) !important; text-decoration: none; width: 36px; height: 36px; text-align: center;">
                            <img
                              src="https://res.cloudinary.com/dbzirtpem/image/upload/v1757799237/instagram_40_40.png"
                              alt="Instagram"
                              width="20"
                              height="20"
                              style="display: block; border: 0; outline: none; text-decoration: none; margin: auto;" />
                          </a>
                        </td>

                        <td style="background-color: #f5f5f5 !important;">
                          <a href="https://www.strava.com/clubs/distanzrunning"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Strava"
                            style="display: inline-block; padding: 8px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.05) !important; text-decoration: none; width: 36px; height: 36px; text-align: center;">
                            <img
                              src="https://res.cloudinary.com/dbzirtpem/image/upload/v1757799275/strava_40_40.png"
                              alt="Strava"
                              width="20"
                              height="20"
                              style="display: block; border: 0; outline: none; text-decoration: none; margin: auto;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Company info -->
                  <div class="company-info" style="color: #666666 !important;">
                    <p class="company-name" style="color: #1a1a1a !important;"><strong>Distanz Running Ltd</strong></p>
                    <p style="color: #666666 !important;">10 Northumberland Place, Richmond TW10 6TS</p>
                    <p style="margin-top: 12px; color: #888888;">
                      © 2025 Distanz Running. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
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