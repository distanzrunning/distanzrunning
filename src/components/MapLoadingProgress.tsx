import React, { useState, useEffect } from 'react'

interface MapLoadingProgressProps {
  isLoading: boolean
  currentStep: string
  onComplete?: () => void
}

export function MapLoadingProgress({ isLoading, currentStep, onComplete }: MapLoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [displayStep, setDisplayStep] = useState('')

  // Define loading steps with their progress weights
  const loadingSteps = {
    'Loading route data...': 20,
    'Processing coordinates...': 40,
    'Adding route to map...': 60,
    'Placing markers...': 80,
    'Finalizing view...': 100
  }

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      setDisplayStep('')
      return
    }

    setDisplayStep(currentStep)
    const targetProgress = loadingSteps[currentStep as keyof typeof loadingSteps] || 0

    // Smooth progress animation
    const startProgress = progress
    const progressDiff = targetProgress - startProgress
    const duration = 300 // ms
    const steps = 20
    const stepSize = progressDiff / steps
    const stepDuration = duration / steps

    let currentStepIndex = 0
    const progressInterval = setInterval(() => {
      currentStepIndex++
      const newProgress = startProgress + (stepSize * currentStepIndex)
      
      setProgress(Math.min(newProgress, targetProgress))
      
      if (currentStepIndex >= steps || newProgress >= targetProgress) {
        clearInterval(progressInterval)
        if (targetProgress === 100) {
          // Small delay before completion
          setTimeout(() => {
            onComplete?.()
          }, 200)
        }
      }
    }, stepDuration)

    return () => clearInterval(progressInterval)
  }, [currentStep, isLoading])

  if (!isLoading && progress === 0) return null

  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300">
      {/* Loading content */}
      <div className="text-center space-y-4 max-w-sm mx-auto px-4">
        
        {/* Spinner */}
        <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
        
        {/* Progress bar container */}
        <div className="w-full max-w-xs mx-auto">
          <div className="mb-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">
              {displayStep}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 transition-colors duration-300">
            <div 
              className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress percentage */}
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 text-center transition-colors duration-300">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage loading states for marathon switching
export function useMarathonLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [stepTimeout, setStepTimeout] = useState<NodeJS.Timeout | null>(null)

  const startLoading = async (marathonName: string) => {
    setIsLoading(true)
    
    // Simulate realistic loading steps
    const steps = [
      { step: 'Loading route data...', delay: 200 },
      { step: 'Processing coordinates...', delay: 300 },
      { step: 'Adding route to map...', delay: 400 },
      { step: 'Placing markers...', delay: 300 },
      { step: 'Finalizing view...', delay: 200 }
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].step)
      await new Promise(resolve => {
        const timeout = setTimeout(resolve, steps[i].delay)
        setStepTimeout(timeout)
      })
    }
  }

  const finishLoading = () => {
    setIsLoading(false)
    setCurrentStep('')
    if (stepTimeout) {
      clearTimeout(stepTimeout)
      setStepTimeout(null)
    }
  }

  const cleanup = () => {
    if (stepTimeout) {
      clearTimeout(stepTimeout)
      setStepTimeout(null)
    }
    setIsLoading(false)
    setCurrentStep('')
  }

  return {
    isLoading,
    currentStep,
    startLoading,
    finishLoading,
    cleanup
  }
}