'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
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
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form after success
        setTimeout(() => {
          setFormData({ email: '', name: '', interests: [], message: '' })
          setSubmitStatus('idle')
        }, 5000)
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', data.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-4 sm:gap-2">
      <div className="flex w-full flex-col items-start justify-center gap-6">
        {/* Email */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="email" className="text-base text-textDefault font-normal">
            Email<span className="text-textSubtle"> *</span>
          </label>
          <input
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-12 rounded-lg px-3 text-base text-textDefault border border-borderNeutral bg-gray-50 dark:bg-neutral-800 hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral"
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
          <label htmlFor="name" className="text-base text-textDefault font-normal">
            Name<span className="text-textSubtle"> *</span>
          </label>
          <input
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-12 rounded-lg px-3 text-base text-textDefault border border-borderNeutral bg-gray-50 dark:bg-neutral-800 hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral"
            id="name"
            autoComplete="name"
            placeholder="First and last name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Interests Checkboxes */}
        <fieldset className="w-full">
          <div className="flex flex-col gap-5">
            <legend className="text-base text-textDefault font-normal">
              What are you interested in?<span className="text-textSubtle"> *</span>
            </legend>
            <div className="flex flex-col gap-3">
              {['Writing articles', 'Race guides', 'Gear reviews', 'Other'].map((interest) => (
                <div key={interest} className="flex flex-row items-center gap-3">
                  <div className="shrink-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={formData.interests.includes(interest)}
                      onClick={() => handleCheckboxChange(interest)}
                      className="flex items-center justify-center w-5 h-5 rounded border border-borderNeutral bg-gray-50 dark:bg-neutral-800 hover:border-borderNeutralHover transition cursor-pointer data-[checked=true]:border-gray-900 data-[checked=true]:bg-gray-900 dark:data-[checked=true]:border-white dark:data-[checked=true]:bg-white"
                      data-checked={formData.interests.includes(interest)}
                    >
                      {formData.interests.includes(interest) && (
                        <Check className="w-3.5 h-3.5 text-white dark:text-gray-900" strokeWidth={3} />
                      )}
                    </button>
                  </div>
                  <label
                    className="text-base cursor-pointer text-textSubtle font-normal leading-tight"
                    onClick={() => handleCheckboxChange(interest)}
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Message */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="message" className="text-base text-textDefault font-normal">
            Would you like to add anything?
          </label>
          <textarea
            className="placeholder:font-medium placeholder:text-textSubtle relative text-left transition-all outline-none min-h-32 rounded-lg px-3 py-3 text-base text-textDefault border border-borderNeutral bg-gray-50 dark:bg-neutral-800 hover:border-borderNeutralHover disabled:opacity-40 focus:border-borderNeutralHover focus:outline-none focus:ring-2 focus:ring-borderNeutral resize-none"
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

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="w-full text-center">
          <p className="text-sm text-green-600 dark:text-green-400">
            Thank you! We'll get back to you within 48 hours.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="w-full text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            Something went wrong. Please try again or email us at info@distanzrunning.com
          </p>
        </div>
      )}
    </form>
  )
}
