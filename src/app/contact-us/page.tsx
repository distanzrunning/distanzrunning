import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Distanz Running',
  description: 'Get in touch with the Distanz Running team. We want to hear from you.',
}

export default function ContactUsPage() {
  return (
    <div className="relative w-full pt-16 md:pt-32 lg:pt-40 pb-0 px-3">
      <div className="relative mx-auto grid items-start max-w-[900px] md:grid-cols-2 gap-8">
        {/* Left Column - Info */}
        <div className="relative pt-8 md:pt-12 pb-8 md:pr-16">
          <div className="relative">
            <div className="flex flex-col gap-6 text-left pb-8">
              <h1 className="font-semibold tracking-tight text-[35px] leading-[40px] md:text-[56px] md:leading-[56px] text-textDefault">
                Contact us
              </h1>
            </div>

            <div className="flex w-full flex-col gap-10">
              <ul className="flex max-w-screen-sm flex-col gap-12">
                <li className="flex flex-col gap-7">
                  <div className="font-normal text-base md:text-lg leading-snug text-textDefault">
                    Want to contribute content, provide feedback, or just say hello? We'd love to hear from you.
                  </div>

                  <ul className="flex max-w-md flex-col gap-6">
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-snug">
                        Submit article ideas or pitches
                      </div>
                    </li>
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-snug">
                        Share feedback on our platform
                      </div>
                    </li>
                    <li className="flex gap-2 text-textSubtle">
                      <Check className="w-4 h-4 flex-shrink-0 mt-1" strokeWidth={2} />
                      <div className="font-normal text-base md:text-lg leading-snug">
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
  )
}
