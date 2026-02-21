"use client"

import { useCallback, useRef, useState } from "react"
import { AssetImage } from "./asset-image"

interface CompareSliderProps {
  realImage: string
  aiImage: string
  title: string
}

export function CompareSlider({ realImage, aiImage, title }: CompareSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const ratio = (clientX - rect.left) / rect.width
    const next = Math.max(5, Math.min(95, ratio * 100))
    setPosition(next)
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const onPointerStop = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full cursor-ew-resize overflow-hidden rounded-xl border border-border/70 bg-black/50 select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerStop}
      onPointerCancel={onPointerStop}
      role="slider"
      aria-label={`Сравнение образов: ${title}`}
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(5, p - 2))
        if (e.key === "ArrowRight") setPosition((p) => Math.min(95, p + 2))
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />

      <div className="absolute inset-0 p-2">
        <AssetImage src={aiImage} alt={`${title} - альтернатива`} fill fit="contain" />
      </div>

      <div
        className="absolute inset-0 p-2"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <AssetImage src={realImage} alt={`${title} - реальность`} fill fit="contain" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/85"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/60 text-white backdrop-blur-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M4 2L1 7L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 2L13 7L10 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
