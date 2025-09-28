import React, { useState, useEffect } from 'react'

interface MapLoadingProgressProps {
  isLoading: boolean
  currentStep: string
  onComplete?: () => void
}

export function MapLoadingProgress({ isLoading, currentStep, onComplete }: MapLoadingProgressProps) {
  const [progress, setProgress] = useState(0)

  // Define loading steps with their progress weights
  const loadingSteps = {
    'Loading route data...': 15,
    'Processing coordinates...': 30,
    'Adding route to map...': 50,
    'Placing markers...': 70,
    'Finalizing view...': 95  // Stop at 95% instead of 100%
  }

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      return
    }

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
      }
    }, stepDuration)

    return () => clearInterval(progressInterval)
  }, [currentStep, isLoading])

  // Effect to handle final progress completion
  useEffect(() => {
    if (!isLoading && progress > 0) {
      // Quickly animate to 100% when finishing
      const finalAnimation = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(finalAnimation)
            return 100
          }
          return prev + 2
        })
      }, 20)
      
      return () => clearInterval(finalAnimation)
    }
  }, [isLoading, progress])

  if (!isLoading && progress === 0) return null

  return (
    <div className="absolute inset-0 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-opacity duration-300">
      {/* Polished progress bar container matching marathon showcase style */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 shadow-lg transition-colors duration-300">
        <div className="w-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg h-2 transition-colors duration-300">
          <div 
            className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-lg transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
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