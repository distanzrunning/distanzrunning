import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import { DarkModeProvider } from '@/components/DarkModeProvider'
import MixpanelAnalytics from '@/components/MixpanelAnalytics'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Distanz Running',
  description: 'Get in touch with the Distanz Running team. We want to hear from you.',
}

export default function ContactUsPage() {
  return (
    <DarkModeProvider>
      {/* Mixpanel Analytics - only runs in production */}
      <MixpanelAnalytics />

      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
        {/* Logo - Centered Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex justify-center">
            <Link href="/" className="svg-container">
              <img
                src="/images/logo_1.svg"
                alt="Distanz Running Logo"
                width="400"
                height="200"
                className="block dark:hidden logo-svg"
                style={{
                  height: '60px',
                  width: 'auto',
                  maxWidth: '100%'
                }}
              />
              <img
                src="/images/logo_white.svg"
                alt="Distanz Running Logo"
                width="400"
                height="200"
                className="hidden dark:block logo-svg"
                style={{
                  height: '60px',
                  width: 'auto',
                  maxWidth: '100%'
                }}
              />
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative w-full pt-8 md:pt-12 pb-16 px-3">
          <div className="relative mx-auto grid items-start max-w-[900px] md:grid-cols-2 gap-8">
        {/* Left Column - Info */}
        <div className="relative pt-8 md:pt-12 pb-8 md:pr-16">
          <div className="relative">
            <div className="flex flex-col gap-6 text-left pb-8">
              <h1 className="font-semibold tracking-tight text-[35px] leading-[1.1] md:text-[56px] md:leading-[1.05] text-textDefault">
                Contact us
              </h1>
            </div>

            <div className="flex w-full flex-col gap-10">
              <ul className="flex max-w-screen-sm flex-col gap-12">
                <li className="flex flex-col gap-7">
                  <div className="font-normal text-base md:text-lg leading-tight text-textDefault">
                    Want to contribute content, provide feedback, or just say hello? We'd love to hear from you.
                  </div>

                  <ul className="flex max-w-md flex-col gap-6">
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-tight">
                        Submit article ideas or pitches
                      </div>
                    </li>
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-tight">
                        Share feedback on our platform
                      </div>
                    </li>
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-tight">
                        Get a response within 48 hours
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="relative pt-8 md:pt-12 pb-8 px-8 md:px-12 bg-neutralBgSubtle rounded-xl">
          <ContactForm />
        </div>
      </div>
    </div>

    {/* Social Links */}
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto text-center">
        <SocialLinks />
      </div>
    </div>
      </div>
    </DarkModeProvider>
  )
}
