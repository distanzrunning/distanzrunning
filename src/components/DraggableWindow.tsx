'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { X, Square, Expand, Shrink } from 'lucide-react'

interface DraggableWindowProps {
  title: string
  onClose: () => void
  children: ReactNode
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

export function DraggableWindow({
  title,
  onClose,
  children,
  initialWidth = 672,
  initialHeight = 600,
  minWidth = 400,
  minHeight = 300,
}: DraggableWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0
  })

  const windowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize position to center of screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialTop = Math.max(50, window.innerHeight / 2 - initialHeight / 2 - 48)
      const initialLeft = window.innerWidth / 2 - initialWidth / 2
      setPosition({ x: initialLeft, y: initialTop })
    }
  }, [initialWidth, initialHeight])

  // Handle titlebar drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return

    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    setIsDragging(true)
  }

  // Handle resize drag
  const handleResizeMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    if (isMaximized) return

    e.stopPropagation()
    setResizeDirection(direction)
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
    })
  }

  // Prevent text selection during drag/resize
  useEffect(() => {
    if (isDragging || resizeDirection) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = resizeDirection ? getCursorClass(resizeDirection).replace('cursor-', '') : 'move'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    return () => {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, resizeDirection])

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Constrain to container bounds
        const containerRect = containerRef.current?.getBoundingClientRect()
        if (containerRect) {
          const maxX = containerRect.width - size.width
          const maxY = containerRect.height - size.height

          setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
          })
        }
      } else if (resizeDirection) {
        const deltaX = e.clientX - resizeStart.mouseX
        const deltaY = e.clientY - resizeStart.mouseY

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.posX
        let newY = resizeStart.posY

        // Handle horizontal resizing
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
        } else if (resizeDirection.includes('w')) {
          const targetWidth = resizeStart.width - deltaX
          newWidth = Math.max(minWidth, targetWidth)
          // Only adjust position if we're not constrained by minWidth
          if (targetWidth >= minWidth) {
            newX = resizeStart.posX + deltaX
          } else {
            // Constrained by minWidth, adjust position to maintain right edge
            newX = resizeStart.posX + (resizeStart.width - minWidth)
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
        } else if (resizeDirection.includes('n')) {
          const targetHeight = resizeStart.height - deltaY
          newHeight = Math.max(minHeight, targetHeight)
          // Only adjust position if we're not constrained by minHeight
          if (targetHeight >= minHeight) {
            newY = resizeStart.posY + deltaY
          } else {
            // Constrained by minHeight, adjust position to maintain bottom edge
            newY = resizeStart.posY + (resizeStart.height - minHeight)
          }
        }

        // Constrain to container bounds
        const containerRect = containerRef.current?.getBoundingClientRect()
        if (containerRect) {
          const maxWidth = containerRect.width - newX
          const maxHeight = containerRect.height - newY

          newWidth = Math.min(newWidth, maxWidth)
          newHeight = Math.min(newHeight, maxHeight)

          // Prevent negative positions
          newX = Math.max(0, newX)
          newY = Math.max(0, newY)
        }

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setResizeDirection(null)
    }

    if (isDragging || resizeDirection) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, resizeDirection, dragOffset, position, size, resizeStart, minWidth, minHeight])

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const getCursorClass = (direction: ResizeDirection) => {
    switch (direction) {
      case 'n':
      case 's':
        return 'cursor-ns-resize'
      case 'e':
      case 'w':
        return 'cursor-ew-resize'
      case 'ne':
      case 'sw':
        return 'cursor-nesw-resize'
      case 'nw':
      case 'se':
        return 'cursor-nwse-resize'
      default:
        return ''
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }}>
      <div
        ref={windowRef}
        className="pointer-events-auto absolute bg-white dark:bg-neutral-900 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        style={
          isMaximized
            ? {
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 0,
              }
            : {
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
              }
        }
      >
        {/* Titlebar */}
        <div
          className="flex items-center justify-center relative px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 cursor-move select-none backdrop-blur-sm"
          onMouseDown={handleMouseDown}
          style={{ minHeight: '40px' }}
        >
          {/* Title - centered */}
          <div className="flex-1 text-center px-8">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {title}
            </h3>
          </div>

          {/* Action buttons - absolute positioned on right */}
          <div className="absolute right-2 flex items-center gap-1">
            <button
              onClick={handleMaximize}
              className="p-1.5 rounded transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 group"
              aria-label={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <>
                  <Square className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:hidden" />
                  <Shrink className="w-4 h-4 text-neutral-700 dark:text-neutral-300 hidden group-hover:block" />
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:hidden" />
                  <Expand className="w-4 h-4 text-neutral-700 dark:text-neutral-300 hidden group-hover:block" />
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Resize handles - only show when not maximized */}
        {!isMaximized && (
          <>
            {/* Top */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${getCursorClass('n')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
            />
            {/* Bottom */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 ${getCursorClass('s')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            />
            {/* Left */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1 ${getCursorClass('w')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
            />
            {/* Right */}
            <div
              className={`absolute top-0 bottom-0 right-0 w-1 ${getCursorClass('e')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            />
            {/* Top-left corner */}
            <div
              className={`absolute top-0 left-0 w-3 h-3 ${getCursorClass('nw')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            />
            {/* Top-right corner */}
            <div
              className={`absolute top-0 right-0 w-3 h-3 ${getCursorClass('ne')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            />
            {/* Bottom-left corner */}
            <div
              className={`absolute bottom-0 left-0 w-3 h-3 ${getCursorClass('sw')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            />
            {/* Bottom-right corner */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 ${getCursorClass('se')}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            />
          </>
        )}
      </div>
    </div>
  )
}
