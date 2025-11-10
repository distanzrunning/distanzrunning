// src/components/ReCaptchaProvider.tsx
'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!recaptchaSiteKey) {
    console.warn('reCAPTCHA site key not found. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment variables.')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
