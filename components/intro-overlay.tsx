"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

interface IntroOverlayProps {
  onEnter: () => void
  visible: boolean
}

export function IntroOverlay({ onEnter, visible }: IntroOverlayProps) {
  const [soundOn, setSoundOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [visible])

  const toggleIntroSound = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/sounds/intro.mp3")
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio
    }
    if (soundOn) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setSoundOn(!soundOn)
  }, [soundOn])

  const handleEnter = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
    onEnter()
  }, [onEnter])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Video background */}
          <div className="absolute inset-0 overflow-hidden">
            {!videoError ? (
              <video
                ref={videoRef}
                src="/videos/intro.mp4"
                muted
                playsInline
                loop
                onError={() => setVideoError(true)}
                className="h-full w-full object-cover opacity-40"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-b from-secondary to-background" />
            )}
            <div className="absolute inset-0 bg-background/60" />
          </div>

          {/* Skip button */}
          <button
            onClick={handleEnter}
            className="absolute top-6 right-6 z-10 text-xs tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Пропустить интро"
          >
            Пропустить
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-serif text-4xl tracking-wider text-foreground md:text-6xl lg:text-7xl"
            >
              ЛЕГЕНДА
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
            >
              Поздравление с днем рождения
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="flex flex-col items-center gap-4 pt-8"
            >
              <button
                onClick={toggleIntroSound}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs tracking-widest uppercase text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
                aria-label={soundOn ? "Выключить звук" : "Включить звук"}
              >
                {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                {soundOn ? "Звук включен" : "Включить звук"}
              </button>

              <button
                onClick={handleEnter}
                className="group relative mt-4 overflow-hidden rounded-none border border-foreground/20 bg-transparent px-10 py-4 text-sm tracking-[0.25em] uppercase text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                aria-label="Войти в историю"
              >
                Войти в историю
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
