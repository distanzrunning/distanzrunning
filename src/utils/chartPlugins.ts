// Shared Chart.js plugin utilities for marathon elevation charts
// Used by both desktop and mobile MarathonShowcase components

/**
 * Create a vertical line plugin for Chart.js that draws a crosshair on hover
 * This plugin draws a pink dashed vertical line at the active chart point
 *
 * @param id - Unique plugin ID (e.g., 'verticalLine' or 'verticalLineMobile')
 * @returns Chart.js plugin object
 */
export const createVerticalLinePlugin = (id: string) => {
  return {
    id,
    afterDatasetsDraw: (chart: any) => {
      if (chart.active && chart.active.length > 0) {
        const ctx = chart.ctx
        const activePoint = chart.active[0]

        const x = activePoint.element.x
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        ctx.save()
        ctx.strokeStyle = '#e43c81' // Pink color matching brand
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4]) // Dashed line pattern
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.stroke()
        ctx.restore()
      }
    }
  }
}
