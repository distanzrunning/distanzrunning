// src/sanity/components/NetElevationInput.tsx

import { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'

export function NetElevationInput(_props: StringInputProps) {
  const elevationGain = useFormValue(['elevationGain']) as number | undefined
  const elevationLoss = useFormValue(['elevationLoss']) as number | undefined

  const calculatedNetElevation = Math.abs((elevationGain || 0) - (elevationLoss || 0))

  // Don't show the field if no elevation data
  if (!elevationGain && !elevationLoss) {
    return null
  }

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1f2937' }}>
          Net Elevation (Auto-calculated)
        </label>
      </div>
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#e0f2fe',
          borderRadius: '6px',
          border: '2px solid #0ea5e9',
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0c4a6e' }}>
          {calculatedNetElevation}m
        </div>
        <div style={{ fontSize: '0.875rem', color: '#075985', fontWeight: 500 }}>
          |{elevationGain || 0}m - {elevationLoss || 0}m|
        </div>
      </div>
    </div>
  )
}
