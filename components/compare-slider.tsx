"use client"

import { useState, useRef, useCallback } from "react"
import { AssetImage } from "./asset-image"

interface CompareSliderProps {
  realImage: string
  aiImage: string
  realLabel: string
  aiLabel: string
}

export function CompareSlider({
  realImage,
  aiImage,
  realLabel,
  aiLabel,
}: CompareSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(2, Math.min(98, x)))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-lg border border-border select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="slider"
      aria-label="Слайдер сравнения"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 2))
        if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 2))
      }}
    >
      {/* AI image (bottom layer - full) */}
      <div className="absolute inset-0">
        <AssetImage src={aiImage} alt={aiLabel} fill />
      </div>

      {/* Real image (top layer - clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <AssetImage src={realImage} alt={realLabel} fill />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-foreground/80"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-foreground/40 bg-background/80 text-foreground">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 2L1 7L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 2L13 7L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 rounded bg-background/70 px-2 py-1 text-[10px] tracking-widest uppercase text-foreground backdrop-blur-sm">
        {realLabel}
      </span>
      <span className="absolute bottom-3 right-3 rounded bg-background/70 px-2 py-1 text-[10px] tracking-widest uppercase text-foreground backdrop-blur-sm">
        {aiLabel}
      </span>
    </div>
  )
}
