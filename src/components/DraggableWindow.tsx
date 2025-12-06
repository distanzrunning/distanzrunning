'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X, Square, Expand, Shrink } from 'lucide-react'

interface DraggableWindowProps {
  title: string
  onClose: () => void
  onMinimize?: () => void
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
  onMinimize,
  children,
  initialWidth = 672,
  initialHeight = 600,
  minWidth = 400,
  minHeight = 300,
}: DraggableWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isSnappedLeft, setIsSnappedLeft] = useState(false)
  const [isSnappedRight, setIsSnappedRight] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | null>(null)
  const [showSnapMenu, setShowSnapMenu] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
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
  const snapMenuRef = useRef<HTMLDivElement>(null)
  const maximizeButtonRef = useRef<HTMLButtonElement>(null)

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
    if (isMaximized || isSnappedLeft || isSnappedRight) {
      // If snapped or maximized, unsnap first
      if (isSnappedLeft || isSnappedRight) {
        setIsSnappedLeft(false)
        setIsSnappedRight(false)
        // Center the window under cursor
        const newWidth = initialWidth
        const newHeight = initialHeight
        setSize({ width: newWidth, height: newHeight })
        setPosition({
          x: e.clientX - newWidth / 2,
          y: e.clientY - 20, // Offset for titlebar
        })
        setDragOffset({
          x: newWidth / 2,
          y: 20,
        })
        setIsDragging(true)
      }
      return
    }

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

  // Close snap menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSnapMenu && snapMenuRef.current && !snapMenuRef.current.contains(e.target as Node)) {
        setShowSnapMenu(false)
      }
    }

    if (showSnapMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSnapMenu])

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

          // Detect snap zones - trigger when window is very close to edges
          const snapThreshold = 10 // Reduced from 100 to only trigger near edges
          const windowLeft = Math.max(0, newX)
          const windowRight = Math.min(newX + size.width, containerRect.width)

          // Show left snap if window is at left edge or very close (within 10px)
          if (windowLeft === 0 || newX < snapThreshold) {
            setSnapPreview('left')
          }
          // Show right snap if window is at right edge or very close (within 10px)
          else if (windowRight === containerRect.width || newX + size.width > containerRect.width - snapThreshold) {
            setSnapPreview('right')
          } else {
            setSnapPreview(null)
          }
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
      // Handle snap on mouse up
      if (isDragging && snapPreview) {
        const containerRect = containerRef.current?.getBoundingClientRect()
        if (containerRect) {
          if (snapPreview === 'left') {
            setIsSnappedLeft(true)
            setPosition({ x: 0, y: 0 })
            setSize({ width: containerRect.width / 2, height: containerRect.height })
          } else if (snapPreview === 'right') {
            setIsSnappedRight(true)
            setPosition({ x: containerRect.width / 2, y: 0 })
            setSize({ width: containerRect.width / 2, height: containerRect.height })
          }
        }
        setSnapPreview(null)
      }
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
    setShowSnapMenu(false)
  }

  const handleSnapLeft = () => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (containerRect) {
      setIsMaximized(false)
      setIsSnappedLeft(true)
      setIsSnappedRight(false)
      setPosition({ x: 0, y: 0 })
      setSize({ width: containerRect.width / 2, height: containerRect.height })
    }
    setShowSnapMenu(false)
  }

  const handleSnapRight = () => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (containerRect) {
      setIsMaximized(false)
      setIsSnappedLeft(false)
      setIsSnappedRight(true)
      setPosition({ x: containerRect.width / 2, y: 0 })
      setSize({ width: containerRect.width / 2, height: containerRect.height })
    }
    setShowSnapMenu(false)
  }

  const handleMaximizeContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowSnapMenu(!showSnapMenu)
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
      {/* Snap Preview Overlay */}
      {snapPreview && (
        <div
          className="pointer-events-none absolute transition-opacity duration-150"
          style={{
            top: '2px',
            bottom: 0,
            left: snapPreview === 'left' ? 0 : '50%',
            width: '50%',
            background: 'repeating-linear-gradient(45deg, rgba(228, 60, 129, 0.03), rgba(228, 60, 129, 0.03) 10px, rgba(228, 60, 129, 0.05) 10px, rgba(228, 60, 129, 0.05) 20px)',
            border: '2px solid rgba(228, 60, 129, 0.4)',
            zIndex: 39,
          }}
        />
      )}

      <div
        ref={windowRef}
        className="pointer-events-auto absolute rounded-lg shadow-2xl flex flex-col overflow-hidden border-b border-neutral-200 dark:border-neutral-700"
        style={
          isMaximized
            ? {
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 0,
              }
            : isSnappedLeft
            ? {
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                borderRadius: 0,
              }
            : isSnappedRight
            ? {
                top: 0,
                left: '50%',
                width: '50%',
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
          className="flex items-center justify-center relative px-3 py-2 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 cursor-move select-none backdrop-blur-md"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleMaximize}
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
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 rounded transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                aria-label="Minimize"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  <path d="M5 16h14" />
                </svg>
              </button>
            )}
            <button
              ref={maximizeButtonRef}
              onClick={handleMaximize}
              onContextMenu={handleMaximizeContextMenu}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
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
        <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-800 border-l border-r border-neutral-200 dark:border-neutral-700">
          {children}
        </div>

        {/* Resize handles - only show when not maximized or snapped */}
        {!isMaximized && !isSnappedLeft && !isSnappedRight && (
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

      {/* Tooltip - rendered to document.body via portal to escape stacking context */}
      {showTooltip && maximizeButtonRef.current && typeof document !== 'undefined' && (() => {
        const buttonRect = maximizeButtonRef.current!.getBoundingClientRect()
        const buttonCenterX = buttonRect.left + buttonRect.width / 2
        const tooltipWidth = 180 // Approximate width of tooltip
        const viewportWidth = window.innerWidth

        // Check if centering would cause overflow on the right
        const wouldOverflowRight = buttonCenterX + tooltipWidth / 2 > viewportWidth - 8
        const isAlignedRight = wouldOverflowRight

        return createPortal(
          <div
            className="fixed pointer-events-none z-[9999]"
            style={
              isAlignedRight
                ? {
                    top: `${buttonRect.top - 38}px`,
                    right: '8px',
                  }
                : {
                    top: `${buttonRect.top - 38}px`,
                    left: `${buttonCenterX}px`,
                    transform: 'translateX(-50%)'
                  }
            }
          >
            <div className={`flex flex-col ${isAlignedRight ? 'items-end' : 'items-center'}`}>
              <div className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white text-xs rounded whitespace-nowrap">
                Right click for more options
              </div>
              {/* Arrow - positioned based on alignment */}
              <div
                className="dark:hidden -mt-px"
                style={
                  isAlignedRight
                    ? {
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgb(23, 23, 23)',
                        marginRight: `${viewportWidth - buttonRect.right + buttonRect.width / 2 - 6}px`
                      }
                    : {
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgb(23, 23, 23)'
                      }
                }
              />
              <div
                className="hidden dark:block -mt-px"
                style={
                  isAlignedRight
                    ? {
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgb(64, 64, 64)',
                        marginRight: `${viewportWidth - buttonRect.right + buttonRect.width / 2 - 6}px`
                      }
                    : {
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgb(64, 64, 64)'
                      }
                }
              />
            </div>
          </div>,
          document.body
        )
      })()}

      {/* Snap Menu - rendered to document.body via portal to escape stacking context */}
      {showSnapMenu && maximizeButtonRef.current && typeof document !== 'undefined' && createPortal(
        <div
          ref={snapMenuRef}
          className="fixed w-44 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 pointer-events-auto z-[9999]"
          style={{
            top: `${maximizeButtonRef.current.getBoundingClientRect().bottom + 5}px`,
            left: `${maximizeButtonRef.current.getBoundingClientRect().right - 176}px`
          }}
        >
          <div className="px-3 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
            Snap to...
          </div>
          <button
            onClick={handleSnapLeft}
            className="w-full px-3 py-2 text-left text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-between transition-colors"
          >
            <span>Left half</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Shift+←</span>
          </button>
          <button
            onClick={handleSnapRight}
            className="w-full px-3 py-2 text-left text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-between transition-colors"
          >
            <span>Right half</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Shift+→</span>
          </button>
          <div className="border-t border-neutral-200 dark:border-neutral-700 mt-1 pt-1">
            <button
              onClick={handleMaximize}
              className="w-full px-3 py-2 text-left text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-between transition-colors"
            >
              <span>Maximize</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Shift+↑</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
