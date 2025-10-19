// Shared marker creation utilities for marathon route visualization
// Used by both desktop and mobile MarathonShowcase components

/**
 * Create an aid station marker (water drop icon)
 * @param size - Size variant: 'small' for mobile (16px), 'large' for desktop (18px)
 * @returns DOM element for the marker
 */
export const createAidStationMarker = (size: 'small' | 'large' = 'large'): HTMLElement => {
  const dimensions = size === 'small' ? { marker: 16, svg: 8 } : { marker: 18, svg: 10 }

  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    background: #60a5fa;
    border: 2px solid white;
    border-radius: 50%;
    width: ${dimensions.marker}px;
    height: ${dimensions.marker}px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 6;
  `

  const dropSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  dropSvg.setAttribute("fill", "none")
  dropSvg.setAttribute("viewBox", "0 0 12 12")
  dropSvg.setAttribute("width", dimensions.svg.toString())
  dropSvg.setAttribute("height", dimensions.svg.toString())

  const dropPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  dropPath.setAttribute("d", "M6 1.5c-1.2 1.6-3.2 3.6-3.2 5.6a3.2 3.2 0 0 0 6.4 0c0-2-2-4-3.2-5.6z")
  dropPath.setAttribute("fill", "white")

  dropSvg.appendChild(dropPath)
  markerElement.appendChild(dropSvg)

  return markerElement
}

/**
 * Create a start marker (green circle)
 * @param size - Size variant: 'small' for mobile (14px), 'large' for desktop (16px)
 * @returns DOM element for the marker
 */
export const createStravaStartMarker = (size: 'small' | 'large' = 'large'): HTMLElement => {
  const dimensions = size === 'small' ? 14 : 16

  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    background: #22c55e;
    border: 2px solid white;
    border-radius: 50%;
    width: ${dimensions}px;
    height: ${dimensions}px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 5;
  `
  return markerElement
}

/**
 * Create a finish marker (checkered flag pattern)
 * @param size - Size variant: 'small' for mobile (14px), 'large' for desktop (16px)
 * @returns DOM element for the marker
 */
export const createStravaFinishMarker = (size: 'small' | 'large' = 'large'): HTMLElement => {
  const dimensions = size === 'small' ? 14 : 16

  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    border: 2px solid white;
    border-radius: 50%;
    width: ${dimensions}px;
    height: ${dimensions}px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    z-index: 5;
  `

  const flagPattern = document.createElement('div')
  flagPattern.style.cssText = `
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(45deg, #000 25%, transparent 25%),
      linear-gradient(-45deg, #000 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #000 75%),
      linear-gradient(-45deg, transparent 75%, #000 75%);
    background-size: 4px 4px;
    background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
    background-color: white;
  `

  markerElement.appendChild(flagPattern)
  return markerElement
}

/**
 * Create a numbered distance marker (e.g., "5", "10", "15")
 * @param number - Number to display
 * @param size - Size variant: 'small' for mobile (20px), 'large' for desktop (24px)
 * @returns DOM element for the marker
 */
export const createStravaNumberMarker = (number: string, size: 'small' | 'large' = 'large'): HTMLElement => {
  const dimensions = size === 'small'
    ? { marker: 20, fontSize: 10 }
    : { marker: 24, fontSize: 11 }

  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    background: white;
    border: 2px solid #e43c81;
    border-radius: 50%;
    width: ${dimensions.marker}px;
    height: ${dimensions.marker}px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
    font-size: ${dimensions.fontSize}px;
    color: #e43c81;
    cursor: pointer;
    z-index: 10;
  `
  markerElement.textContent = number
  return markerElement
}

/**
 * Create a flag marker for intermediate points
 * @param size - Size variant: 'small' for mobile (14px), 'large' for desktop (16px)
 * @returns DOM element for the marker
 */
export const createStravaFlagMarker = (size: 'small' | 'large' = 'large'): HTMLElement => {
  const dimensions = size === 'small'
    ? { marker: 14, svg: 7 }
    : { marker: 16, svg: 8 }

  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    background: white;
    border: 2px solid #e43c81;
    border-radius: 50%;
    width: ${dimensions.marker}px;
    height: ${dimensions.marker}px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 8;
  `

  const flagSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  flagSvg.setAttribute("fill", "none")
  flagSvg.setAttribute("viewBox", "0 0 16 16")
  flagSvg.setAttribute("width", dimensions.svg.toString())
  flagSvg.setAttribute("height", dimensions.svg.toString())

  const flagPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  flagPath.setAttribute("d", "M3 3.5a.5.5 0 011 0V5h8V3.5a.5.5 0 011 0V13h-1V9H4v4H3V5.667v-.019z")
  flagPath.setAttribute("fill", "#e43c81")

  flagSvg.appendChild(flagPath)
  markerElement.appendChild(flagSvg)

  return markerElement
}

/**
 * Create a hover marker for chart interactions (desktop only)
 * @returns DOM element for the marker
 */
export const createHoverMarkerElement = (): HTMLElement => {
  const markerElement = document.createElement('div')
  markerElement.style.cssText = `
    background: #1e40af;
    border: 2px solid white;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    opacity: 0;
    pointer-events: none;
    z-index: 1;
  `
  return markerElement
}
