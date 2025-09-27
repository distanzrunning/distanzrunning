// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

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
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
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
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          /* Force light mode */
          :root {
            color-scheme: light !important;
          }
          
          /* Reset and base styles */
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            line-height: 1.6;
            color: #1a1a1a !important;
            background-color: #fafafa !important;
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          /* Gmail and client-specific fixes */
          u + #body .email-wrapper { background-color: #fafafa !important; }
          u + #body .content-container { background-color: #ffffff !important; }
          
          /* Full width structure */
          .email-wrapper {
            width: 100% !important;
            background-color: #fafafa !important;
            margin: 0;
            padding: 48px 16px;
          }
          
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fafafa !important;
          }
          
          .content-container {
            background-color: #ffffff !important;
            border-radius: 12px;
            margin: 0 auto;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            border: 1px solid #f0f0f0;
          }
          
          /* Header section */
          .header-section {
            background-color: #ffffff !important;
            padding: 48px 40px 32px 40px;
            text-align: center;
            border-bottom: 1px solid #f5f5f5;
          }
          
          /* Logo styling */
          .logo {
            height: 64px;
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
          
          /* Typography */
          .greeting {
            font-family: 'Inter', sans-serif !important;
            color: #1a1a1a !important;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 16px;
            text-align: left;
          }
          
          .intro-text {
            font-family: 'Inter', sans-serif !important;
            color: #4a4a4a !important;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            margin-bottom: 16px;
            text-align: left;
          }
          
          .instruction-text {
            font-family: 'Inter', sans-serif !important;
            color: #1a1a1a !important;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            margin-bottom: 32px;
            text-align: left;
          }
          
          /* Button styling - no hover states */
          .button-container {
            text-align: left;
            margin: 32px 0 24px 0;
          }
          
          .button {
            display: inline-block !important;
            padding: 16px 32px !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #ffffff !important;
            text-decoration: none !important;
            border-radius: 8px;
            font-weight: 500;
            font-family: 'Inter', sans-serif !important;
            font-size: 16px;
            line-height: 1;
            border: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
            text-align: center;
          }
          
          /* Footer */
          .footer-section {
            background-color: #fafafa !important;
            padding: 32px 20px 20px 20px;
            text-align: center;
          }
          
          /* Social links - simple styling */
          .social-links {
            margin-bottom: 24px;
            background-color: #fafafa !important;
          }
          
          .social-links table {
            margin: 0 auto;
            background-color: #fafafa !important;
          }
          
          .social-links td {
            padding: 0 8px;
            background-color: #fafafa !important;
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
            font-family: 'Inter', sans-serif !important;
            margin-bottom: 16px;
            line-height: 1.4;
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
        <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa !important;">
          <tr>
            <td align="center" style="background-color: #fafafa !important;">
              <div class="email-container">
                <div class="content-container" style="background-color: #ffffff !important;">
                  
                  <!-- Header with logo -->
                  <div class="header-section" style="background-color: #ffffff !important;">
                    <img 
                      src="https://res.cloudinary.com/dbzirtpem/image/upload/v1757880131/Logo_400_x_128_px_9.png" 
                      alt="Distanz Running" 
                      class="logo"
                      width="200"
                      height="64"
                      style="height: 64px; width: auto; display: block; margin: 0 auto;"
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
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${confirmationUrl}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="17%" stroke="f" fillcolor="#000000">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:'Inter',sans-serif;font-size:16px;font-weight:500;">Confirm Your Email</center>
                      </v:roundrect>
                      <![endif]-->
                      <!--[if !mso]><!-->
                      <a href="${confirmationUrl}" class="button" style="background: #000000 !important; color: #ffffff !important; text-decoration: none !important; display: inline-block; padding: 16px 32px; border-radius: 8px; font-weight: 500; font-family: 'Inter', sans-serif; font-size: 16px; border: 2px solid #000000 !important;">Confirm Your Email</a>
                      <!--<![endif]-->
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="footer-section" style="background-color: #fafafa !important;">
                  <!-- Social links using the exact same code as your original working version -->
                  <div class="social-links" style="background-color: #fafafa !important;">
                    <table cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa !important;">
                      <tr>
                        <td style="background-color: #fafafa !important;">
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

                        <td style="background-color: #fafafa !important;">
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

                        <td style="background-color: #fafafa !important;">
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

                        <td style="background-color: #fafafa !important;">
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