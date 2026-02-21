"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { introData } from "@/lib/site-data"

interface IntroOverlayProps {
  onEnter: (markAsSeen: boolean) => void
  onStartAudio: (restart?: boolean) => Promise<void>
  visible: boolean
}

export function IntroOverlay({
  onEnter,
  onStartAudio,
  visible,
}: IntroOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [introStarted, setIntroStarted] = useState(false)

  const sequence = useMemo(
    () => [
      {
        title: introData.title,
        subtitle: introData.subtitle,
        durationMs: 4000,
      },
      ...introData.steps,
    ],
    []
  )

  const isFinalStep = stepIndex >= sequence.length - 1

  useEffect(() => {
    if (!visible) return

    setStepIndex(0)
    setVideoError(false)
    setIntroStarted(false)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        setVideoError(true)
      })
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !introStarted || isFinalStep) return

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, sequence.length - 1))
    }, sequence[stepIndex].durationMs)

    return () => window.clearTimeout(timer)
  }, [visible, introStarted, isFinalStep, sequence, stepIndex])

  useEffect(() => {
    if (!visible || !videoRef.current || videoError) return
    videoRef.current.play().catch(() => {
      setVideoError(true)
    })
  }, [visible, stepIndex, videoError])

  const handleSkip = useCallback(() => {
    onEnter(false)
  }, [onEnter])

  const handleStartIntro = useCallback(async () => {
    await onStartAudio(false)
    setIntroStarted(true)
  }, [onStartAudio])

  const handleEnter = useCallback(async () => {
    if (!introStarted) {
      await onStartAudio(true)
      setIntroStarted(true)
    }
    onEnter(true)
  }, [introStarted, onEnter, onStartAudio])

  const progress = introStarted ? ((stepIndex + 1) / sequence.length) * 100 : 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          <div className="absolute inset-0 overflow-hidden">
            {!videoError ? (
              <motion.video
                ref={videoRef}
                src="/videos/intro.mp4"
                muted
                playsInline
                loop
                onError={() => setVideoError(true)}
                animate={{ scale: 1.04 + stepIndex * 0.004 }}
                transition={{ duration: 5.8, ease: "easeOut" }}
                className="h-full w-full object-cover opacity-40"
              />
            ) : (
              <motion.div
                animate={{ scale: 1.02 + stepIndex * 0.003 }}
                transition={{ duration: 5.8, ease: "easeOut" }}
                className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,#0a0a0a_0%,#131313_45%,#050505_100%)]"
              />
            )}

            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.5)_75%)]" />
          </div>

          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 z-20 text-[11px] tracking-[0.24em] uppercase text-white/70 transition-colors hover:text-white"
            aria-label={introData.skipText}
          >
            {introData.skipText}
          </button>

          <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {!introStarted ? (
                <motion.div
                  key="intro-gate"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-3xl"
                >
                  <h1 className="font-serif text-4xl leading-tight tracking-[0.08em] text-white md:text-6xl">
                    {introData.title}
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-sm leading-loose tracking-[0.2em] text-white/78 md:text-base">
                    {introData.subtitle}
                  </p>
                  <button
                    onClick={handleStartIntro}
                    className="mt-10 border border-white/70 px-8 py-3 text-[11px] tracking-[0.24em] uppercase text-white transition-all hover:bg-white hover:text-black"
                    aria-label={introData.startText}
                  >
                    {introData.startText}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 1.01 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-4xl"
                >
                  <h1 className="font-serif text-4xl leading-tight tracking-[0.08em] text-white md:text-6xl lg:text-7xl">
                    {sequence[stepIndex].title}
                  </h1>

                  {sequence[stepIndex].subtitle && (
                    <p className="mx-auto mt-8 max-w-3xl text-sm leading-loose tracking-[0.2em] text-white/78 md:text-base">
                      {sequence[stepIndex].subtitle}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!videoError && (
              <p className="mt-10 text-[10px] tracking-[0.26em] uppercase text-white/35">
                {introData.loadingVideoText}
              </p>
            )}
            {videoError && (
              <p className="mt-10 text-[10px] tracking-[0.26em] uppercase text-white/35">
                {introData.fallbackTitle}
              </p>
            )}
          </div>

          <div className="relative z-10 border-t border-white/10 px-6 py-5">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-sm">
                <div className="h-[1px] w-full bg-white/15">
                  <motion.div
                    className="h-[1px] bg-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-2 text-[10px] tracking-[0.24em] uppercase text-white/55">
                  {introStarted
                    ? `Шаг ${Math.min(stepIndex + 1, sequence.length)} из ${sequence.length}`
                    : "Ожидание старта"}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                {introStarted && (
                  <span className="text-[10px] tracking-[0.24em] uppercase text-white/45">
                    Звук включен
                  </span>
                )}

                {introStarted && isFinalStep && (
                  <button
                    onClick={handleEnter}
                    className="border border-white px-7 py-2.5 text-[11px] tracking-[0.24em] uppercase text-white transition-all hover:bg-white hover:text-black"
                    aria-label={introData.enterText}
                  >
                    {introData.enterText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
