// src/sanity/components/ProfileInput.tsx

import { useEffect } from 'react'
import { StringInputProps, set, unset } from 'sanity'
import { calculateProfile } from '../schemaTypes/raceGuideType'
import { useFormValue } from 'sanity'

export function ProfileInput(props: StringInputProps) {
  const elevationGain = useFormValue(['elevationGain']) as number | undefined
  const elevationLoss = useFormValue(['elevationLoss']) as number | undefined

  const calculatedProfile = calculateProfile(elevationGain || 0, elevationLoss || 0)

  useEffect(() => {
    // Auto-update the profile field when elevation values change
    if (elevationGain !== undefined || elevationLoss !== undefined) {
      props.onChange(set(calculatedProfile))
    } else {
      props.onChange(unset())
    }
  }, [elevationGain, elevationLoss, calculatedProfile, props])

  // Don't show the field if no elevation data
  if (!elevationGain && !elevationLoss) {
    return null
  }

  const profileLabels: Record<string, string> = {
    flat: 'Flat',
    rolling: 'Rolling',
    hilly: 'Hilly',
    mountainous: 'Mountainous',
  }

  const netElevation = Math.abs((elevationGain || 0) - (elevationLoss || 0))

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Profile (Auto-calculated)
        </label>
      </div>
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#f1f3f4',
          borderRadius: '4px',
          border: '1px solid #d4d8dd',
        }}
      >
        <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
          {profileLabels[calculatedProfile]}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#66758d' }}>
          Net elevation: {netElevation}m (Gain: {elevationGain || 0}m - Loss:{' '}
          {elevationLoss || 0}m)
        </div>
        <div style={{ fontSize: '0.75rem', color: '#66758d', marginTop: '0.25rem' }}>
          Flat: &lt;50m | Rolling: 50-200m | Hilly: 200-500m | Mountainous: &gt;500m
        </div>
      </div>
    </div>
  )
}
