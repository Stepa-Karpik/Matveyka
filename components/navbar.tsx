"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { AudioControls } from "./audio-controls"
import { siteConfig } from "@/lib/site-data"

const NAV_ITEMS = [
  { label: "Кто", href: "#whois" },
  { label: "Мемы", href: "#memes" },
  { label: "Мультивселенная", href: "#multiverse" },
  { label: "Хронология", href: "#timeline" },
  { label: "Письмо", href: "#letter" },
]

interface NavbarProps {
  audioEnabled: boolean
  audioVolume: number
  onAudioToggle: () => void
  onVolumeChange: (v: number) => void
  onLogoClick: () => void
}

export function Navbar({
  audioEnabled,
  audioVolume,
  onAudioToggle,
  onVolumeChange,
  onLogoClick,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setMobileOpen(false)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="text-xs font-medium tracking-[0.35em] uppercase text-foreground transition-opacity hover:opacity-70"
          aria-label="Главная"
        >
          {siteConfig.logoText}
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <AudioControls
            enabled={audioEnabled}
            volume={audioVolume}
            onToggle={onAudioToggle}
            onVolumeChange={onVolumeChange}
          />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <AudioControls
            enabled={audioEnabled}
            volume={audioVolume}
            onToggle={onAudioToggle}
            onVolumeChange={onVolumeChange}
          />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="py-2 text-left text-xs tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
