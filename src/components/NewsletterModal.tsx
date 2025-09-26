'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useTime, useTransform } from 'framer-motion'

type NewsletterModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setIsSubmitted(false)
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative transition-colors duration-300">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 text-white hover:text-gray-200 transition-colors bg-black/20 dark:bg-white/20 rounded-full backdrop-blur-sm"
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

              {/* Hero section with background image and white logo */}
              <div 
                className="relative h-48 bg-cover bg-center bg-neutral-900"
                style={{ 
                  backgroundImage: 'url("/images/berlin_cover.png")',
                  backgroundPosition: 'center center'
                }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* White logo centered */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <img
                    src="/images/logo_white.svg"
                    alt="Distanz Running Logo"
                    className="h-16 w-auto"
                  />
                </div>
              </div>

              {/* Content section */}
              <div className="px-8 pt-6 pb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  Stay in the Loop
                </h2>
                <p className="text-gray-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 transition-colors duration-300">
                  Be the first to know when we launch with exclusive running content, 
                  marathon guides, and gear reviews.
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
                    <p className="text-gray-600 dark:text-neutral-300 text-sm">
                      You'll receive our best running content and marathon guides straight to your inbox.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 bg-white dark:bg-neutral-700 font-['InterVariable','Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] transition-colors duration-300"
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
                      className="w-full bg-black dark:bg-neutral-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-500 transition-colors focus:outline-none font-['InterVariable','Inter',-apple-system,BlinkMacSystemFont,'Segue_UI',Roboto,sans-serif] disabled:opacity-50 disabled:cursor-not-allowed"
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
  const time = useTime()
  
  // Same rotating animation as ExploreButton
  const rotate = useTransform(time, (latest) => (latest / 25) % 360)
  
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg, transparent 85%, rgba(236, 72, 153, 0.15) 88%, rgba(236, 72, 153, 0.3) 92%, rgba(236, 72, 153, 0.5) 96%, rgba(236, 72, 153, 0.7) 100%)`
  })

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <div className="flex justify-center">
        <div className="relative">
          <button
            onClick={handleOpenModal}
            className="relative inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white dark:text-black border border-black dark:border-neutral-300 rounded-lg bg-black dark:bg-neutral-50 hover:bg-neutral-800 dark:hover:bg-white focus:outline-none active:scale-[0.98] active:duration-100 transition-all duration-200 z-10 group"          >
            <span style={{ lineHeight: '18px' }}>Newsletter</span>
          </button>
          
          {/* Rotating gradient border */}
          <motion.div
            className="absolute inset-0 rounded-lg z-0 pointer-events-none"
            style={{
              background: rotatingBg,
              willChange: 'transform',
              mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
              maskComposite: 'xor',
              WebkitMask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
              WebkitMaskComposite: 'xor',
              padding: '1px'
            }}
          />
        </div>
      </div>

      <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  )
}