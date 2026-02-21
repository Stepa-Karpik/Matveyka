"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AudioControlsProps {
  enabled: boolean
  volume: number
  onToggle: () => void
  onVolumeChange: (v: number) => void
}

export function AudioControls({
  enabled,
  volume,
  onToggle,
  onVolumeChange,
}: AudioControlsProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => {
          if (!open) {
            setOpen(true)
          } else {
            onToggle()
          }
        }}
        className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={enabled ? "Выключить звук" : "Включить звук"}
      >
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-3 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-xl"
          >
            <button
              onClick={onToggle}
              className="text-xs tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              {enabled ? "Выключить звук" : "Включить звук"}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="h-1 w-24 cursor-pointer accent-foreground"
              aria-label="Громкость"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
