"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IntroOverlay } from "@/components/intro-overlay"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { WhoIsSection } from "@/components/whois-section"
import { MemeGallery } from "@/components/meme-gallery"
import { MultiverseSection } from "@/components/multiverse-section"
import { TimelineSection } from "@/components/timeline-section"
import { LetterSection } from "@/components/letter-section"
import { FinaleSection } from "@/components/finale-section"
import { useAudio } from "@/hooks/use-audio"
import { siteConfig } from "@/lib/site-data"

const INTRO_SEEN_KEY = "introSeen"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [siteVisible, setSiteVisible] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const audio = useAudio()

  // Easter egg
  const logoClickCount = useRef(0)
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    setHydrated(true)
    try {
      const seen = localStorage.getItem(INTRO_SEEN_KEY)
      if (seen === "true") {
        setShowIntro(false)
        setSiteVisible(true)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleEnterSite = useCallback((markAsSeen: boolean) => {
    setShowIntro(false)
    setSiteVisible(true)
    try {
      if (markAsSeen) {
        localStorage.setItem(INTRO_SEEN_KEY, "true")
      }
    } catch {
      // ignore
    }
  }, [])

  const handleReplay = useCallback(() => {
    try {
      localStorage.removeItem(INTRO_SEEN_KEY)
    } catch {
      // ignore
    }
    audio.stopAudio(true)
    setSiteVisible(false)
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    setTimeout(() => setShowIntro(true), 100)
  }, [audio.stopAudio])

  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current)
    if (logoClickCount.current >= 7) {
      logoClickCount.current = 0
      setShowSecret(true)
    } else {
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0
      }, 2000)
    }
  }, [])

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Intro overlay */}
      <IntroOverlay
        visible={showIntro}
        onEnter={handleEnterSite}
        onStartAudio={audio.startIntroAudio}
      />

      {/* Main site */}
      {siteVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Navbar
            audioEnabled={audio.enabled}
            audioVolume={audio.volume}
            onAudioToggle={audio.toggleSound}
            onVolumeChange={audio.setVolume}
            onLogoClick={handleLogoClick}
          />

          <HeroSection />
          <WhoIsSection />
          <MemeGallery />
          <MultiverseSection />
          <TimelineSection />
          <LetterSection />
          <FinaleSection onReplay={handleReplay} />

          {/* Footer */}
          <footer className="border-t border-border/30 py-8 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">
              {siteConfig.tagline}
            </p>
          </footer>
        </motion.div>
      )}

      {/* Secret modal (easter egg) */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-sm"
            onClick={() => setShowSecret(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Секретное сообщение"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-md p-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 font-serif text-xl leading-relaxed text-foreground md:text-2xl">
                {siteConfig.secretMessage}
              </p>
              <button
                onClick={() => setShowSecret(false)}
                className="mt-4 text-xs tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
