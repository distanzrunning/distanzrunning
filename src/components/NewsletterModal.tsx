'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type NewsletterModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Combined effect: handle body scroll lock, escape key, and form reset
  useEffect(() => {
    if (!isOpen) return

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Reset form state
    setEmail('')
    setIsSubmitted(false)
    setError('')
    setIsSubmitting(false)

    // Setup escape key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        // Handle complex error objects from API
        let errorMessage = 'Something went wrong. Please try again.'
        
        if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
        } else if (data.detail) {
          errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
        } else if (data.message) {
          errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative transition-colors duration-300">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 text-white hover:text-gray-200 transition-colors bg-black/20 dark:bg-white/20 rounded-full backdrop-blur-sm"
                aria-label="Close newsletter signup"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>

              {/* Hero section with optimized background image and white logo */}
              <div className="relative h-48 bg-neutral-900 overflow-hidden">
                {/* Optimized background image - Using JPEG (337KB vs 1.6MB PNG) */}
                <Image
                  src="/images/berlin_cover.jpg"
                  alt="Berlin Marathon Background"
                  fill
                  className="object-cover"
                  priority
                  quality={85}
                  sizes="(max-width: 448px) 100vw, 448px"
                />
                
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                
                {/* White logo centered */}
                <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
                  <Image
                    src="/images/logo_white.svg"
                    alt="Distanz Running Logo"
                    width={64}
                    height={64}
                    className="h-12 sm:h-16 w-auto max-w-full"
                    priority
                  />
                </div>
              </div>

              {/* Content section */}
              <div className="px-8 pt-6 pb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Stay in the Loop
                </h2>
                <p className="text-gray-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 transition-colors duration-300">
                  Be the first to know when we launch with exclusive running content, gear reviews, and interactive race guides.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Welcome to the team!</h3>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 bg-white dark:bg-neutral-700 font-['InterVariable','Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] transition-colors duration-300"
                        style={{ fontSize: '15px', lineHeight: '1.5' }}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm text-left"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black dark:bg-white text-white dark:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none font-['InterVariable','Inter',-apple-system,BlinkMacSystemFont,'Segue_UI',Roboto,sans-serif] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontSize: '15px', lineHeight: '1.5' }}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                <p className="text-xs text-gray-500 dark:text-neutral-400 text-center transition-colors duration-300">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function NewsletterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleOpenModal}
          className="group whitespace-nowrap font-medium text-sm relative m-0 flex cursor-pointer select-none items-center rounded-lg border-none p-0 no-underline outline-none ease-out focus-visible:outline-none active:scale-[0.98] active:duration-100 h-12 gap-2 px-5 justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <span className="font-sans font-semibold text-sm leading-snug">Newsletter</span>
        </button>
      </div>

      <NewsletterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}