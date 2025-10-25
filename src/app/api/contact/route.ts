// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, interests, message } = await request.json()

    // Validate required fields
    if (!email || !name || !interests || interests.length === 0) {
      return NextResponse.json(
        { error: 'Email, name, and at least one interest are required' },
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

    // Format interests as a bulleted list
    const interestsList = interests.map((interest: string) => `• ${interest}`).join('\n')

    // Create email HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Contact Form Submission - Distanz Running</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #fafafa;
            margin: 0;
            padding: 0;
          }

          .email-wrapper {
            width: 100%;
            background-color: #fafafa;
            padding: 48px 16px;
          }

          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            border: 1px solid #f0f0f0;
          }

          .header-section {
            background-color: #ffffff;
            padding: 32px 40px;
            border-bottom: 1px solid #f5f5f5;
          }

          .header-title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .content-section {
            padding: 40px;
          }

          .field {
            margin-bottom: 24px;
          }

          .field-label {
            font-size: 14px;
            font-weight: 600;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }

          .field-value {
            font-size: 16px;
            color: #1a1a1a;
            line-height: 1.5;
          }

          .interests-list {
            margin-top: 8px;
            padding-left: 0;
            list-style: none;
          }

          .interests-list li {
            padding: 4px 0;
            color: #1a1a1a;
          }

          .message-box {
            background-color: #f9f9f9;
            border-left: 3px solid #e43c81;
            padding: 16px;
            border-radius: 4px;
            margin-top: 8px;
          }

          .footer-section {
            background-color: #f9f9f9;
            padding: 24px 40px;
            border-top: 1px solid #f0f0f0;
            text-align: center;
          }

          .footer-text {
            font-size: 12px;
            color: #888888;
            margin: 0;
          }

          @media only screen and (max-width: 600px) {
            .header-section,
            .content-section,
            .footer-section {
              padding: 24px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header-section">
              <h1 class="header-title">New Contact Form Submission</h1>
            </div>

            <div class="content-section">
              <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${name}</div>
              </div>

              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${email}" style="color: #e43c81; text-decoration: none;">${email}</a></div>
              </div>

              <div class="field">
                <div class="field-label">Interests</div>
                <ul class="interests-list">
                  ${interests.map((interest: string) => `<li>• ${interest}</li>`).join('')}
                </ul>
              </div>

              ${message ? `
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">
                  <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              ` : ''}
            </div>

            <div class="footer-section">
              <p class="footer-text">
                Sent via Distanz Running contact form • ${new Date().toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  timeZone: 'Europe/London'
                })}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `

    // Create plain text version
    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}

Interests:
${interestsList}

${message ? `Message:\n${message}` : ''}

---
Sent via Distanz Running contact form
${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/London' })}
    `

    // Send email via Mailgun
    const emailResponse = await fetch(
      `${process.env.MAILGUN_API_BASE_URL}/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Distanz Running Contact Form <contact@${process.env.MAILGUN_DOMAIN}>`,
          to: 'info@distanzrunning.com',
          'h:Reply-To': email, // Allow direct reply to the submitter
          subject: `Contact Form: ${name} - ${interests[0]}`,
          html: emailHtml,
          text: emailText,
          'o:tag': 'contact-form',
          'o:tracking': 'no',
        })
      }
    )

    const emailData = await emailResponse.json()

    if (emailResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Thank you for getting in touch! We\'ll respond within 48 hours.'
      })
    } else {
      console.error('Email send error:', emailData)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or email us directly at info@distanzrunning.com' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Network error. Please try again later.' },
      { status: 500 }
    )
  }
}
