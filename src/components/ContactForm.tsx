'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    interests: [] as string[],
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(i => i !== value)
        : [...prev.interests, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')

      // Reset form after success
      setTimeout(() => {
        setFormData({ email: '', name: '', phone: '', interests: [], message: '' })
        setSubmitStatus('idle')
      }, 3000)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-4 sm:gap-2">
      <div className="flex w-full flex-col items-start justify-center gap-6">
        {/* Email */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="email" className="text-base text-textDefault">
            Email<span className="text-textSubtle"> *</span>
          </label>
          <input
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-12 rounded-lg px-3 text-base text-textDefault border border-borderNeutral bg-surface hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral"
            id="email"
            autoComplete="email"
            placeholder="name@email.com"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        {/* Name */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="name" className="text-base text-textDefault">
            Name<span className="text-textSubtle"> *</span>
          </label>
          <input
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-12 rounded-lg px-3 text-base text-textDefault border border-borderNeutral bg-surface hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral"
            id="name"
            autoComplete="name"
            placeholder="First and last name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Phone */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="phone" className="text-base text-textDefault">
            Phone (incl. country code)
          </label>
          <input
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-12 rounded-lg px-3 text-base text-textDefault border border-borderNeutral bg-surface hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral"
            id="phone"
            autoComplete="tel"
            placeholder="+1 (123) - 456 78 90"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        {/* Interests Checkboxes */}
        <fieldset className="w-full">
          <div className="flex flex-col gap-5">
            <legend className="text-base text-textDefault">
              What are you interested in?<span className="text-textSubtle"> *</span>
            </legend>
            <div className="flex flex-col gap-3">
              {['Writing articles', 'Race guides', 'Gear reviews', 'Other'].map((interest) => (
                <div key={interest} className="flex flex-row items-center gap-2 text-textSubtle">
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleCheckboxChange(interest)}
                      className="w-6 h-6 cursor-pointer rounded border border-borderNeutral bg-surface hover:border-borderNeutralHover checked:bg-pink-500 checked:border-pink-500 focus:ring-2 focus:ring-borderNeutral transition"
                    />
                  </div>
                  <label className="text-base cursor-pointer" htmlFor={interest}>
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Message */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="message" className="text-base text-textDefault">
            Would you like to add anything?
          </label>
          <textarea
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-32 rounded-lg px-3 py-3 text-base text-textDefault border border-borderNeutral bg-surface hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral resize-none"
            id="message"
            placeholder="Tell us more about your interests"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 self-center md:self-start">
          <button
            type="submit"
            disabled={isSubmitting || !formData.email || !formData.name || formData.interests.length === 0}
            className="group whitespace-nowrap font-medium text-base relative flex cursor-pointer select-none items-center rounded-lg border-none p-0 no-underline outline-none transition ease-out focus-visible:outline-none active:scale-[0.98] active:duration-100 h-12 gap-2 px-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed justify-center"
          >
            {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent!' : 'Send'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="w-full text-center">
          <p className="text-sm text-green-600 dark:text-green-400">
            Thank you! We'll get back to you soon.
          </p>
        </div>
      )}
    </form>
  )
}
