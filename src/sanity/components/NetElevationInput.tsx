// src/sanity/components/NetElevationInput.tsx

import { useEffect } from 'react'
import { NumberInputProps, set, unset } from 'sanity'
import { useFormValue } from 'sanity'

export function NetElevationInput(props: NumberInputProps) {
  const elevationGain = useFormValue(['elevationGain']) as number | undefined
  const elevationLoss = useFormValue(['elevationLoss']) as number | undefined

  const calculatedNetElevation = Math.abs((elevationGain || 0) - (elevationLoss || 0))

  useEffect(() => {
    // Auto-update the net elevation field when elevation values change
    if (elevationGain !== undefined || elevationLoss !== undefined) {
      props.onChange(set(calculatedNetElevation))
    } else {
      props.onChange(unset())
    }
  }, [elevationGain, elevationLoss, calculatedNetElevation, props])

  // Don't show the field if no elevation data
  if (!elevationGain && !elevationLoss) {
    return null
  }

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Net Elevation (Auto-calculated)
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
        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          {calculatedNetElevation}m
        </div>
        <div style={{ fontSize: '0.875rem', color: '#66758d' }}>
          |{elevationGain || 0}m - {elevationLoss || 0}m|
        </div>
      </div>
    </div>
  )
}
