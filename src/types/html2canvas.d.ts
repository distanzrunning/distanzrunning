declare module 'html2canvas' {
  export interface Html2CanvasOptions {
    allowTaint?: boolean
    backgroundColor?: string | null
    canvas?: HTMLCanvasElement
    foreignObjectRendering?: boolean
    imageTimeout?: number
    logging?: boolean
    onclone?: (clonedDoc: Document) => void
    proxy?: string
    removeContainer?: boolean
    scale?: number
    useCORS?: boolean
    width?: number
    height?: number
    x?: number
    y?: number
    scrollX?: number
    scrollY?: number
    windowWidth?: number
    windowHeight?: number
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>
}
