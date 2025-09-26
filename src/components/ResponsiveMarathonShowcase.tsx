// src/components/ResponsiveMarathonShowcase.tsx
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// ✅ point desktop to MarathonShowcase.tsx and grab the named export
const MarathonMajorsShowcase = dynamic(
  () => import('./MarathonShowcase').then(m => m.MarathonMajorsShowcase),
  { ssr: false }
)

// ✅ mobile file/ export name already matches
const MarathonMajorsShowcaseMobile = dynamic(
  () => import('./MarathonMajorsShowcaseMobile').then(m => m.MarathonMajorsShowcaseMobile),
  { ssr: false }
)

const LG_MIN_WIDTH = 1024

export default function ResponsiveMarathonShowcase() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${LG_MIN_WIDTH}px)`)
    const setFromMQ = () => setIsDesktop(mq.matches)
    setFromMQ()
    mq.addEventListener?.('change', setFromMQ) ?? mq.addListener(setFromMQ)
    return () => mq.removeEventListener?.('change', setFromMQ) ?? mq.removeListener(setFromMQ)
  }, [])

  if (isDesktop === null) return null
  return isDesktop ? <MarathonMajorsShowcase /> : <MarathonMajorsShowcaseMobile />
}