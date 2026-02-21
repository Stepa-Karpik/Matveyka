"use client"

import { motion } from "framer-motion"
import { finaleData } from "@/lib/site-data"

interface FinaleSectionProps {
  onReplay: () => void
}

export function FinaleSection({ onReplay }: FinaleSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="mb-16 font-serif text-4xl tracking-wide text-foreground md:text-6xl lg:text-8xl"
      >
        {finaleData.title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <button
          onClick={onReplay}
          className="border border-foreground/20 px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
          aria-label={finaleData.replayText}
        >
          {finaleData.replayText}
        </button>

        <button
          onClick={scrollToTop}
          className="text-xs tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
          aria-label={finaleData.backToTopText}
        >
          {finaleData.backToTopText}
        </button>
      </motion.div>
    </section>
  )
}
