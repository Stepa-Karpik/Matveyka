"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { whoIsData } from "@/lib/site-data"

interface CardModalProps {
  card: (typeof whoIsData.cards)[0] | null
  onClose: () => void
}

function CardModal({ card, onClose }: CardModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={card.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4 }}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>

            <div className="mb-8 aspect-square w-full max-w-[380px] mx-auto overflow-hidden rounded-lg border border-border/60">
              <AssetImage
                src={card.image}
                alt={card.title}
                width={380}
                height={380}
                className="h-full w-full"
              />
            </div>

            <h3 className="mb-4 font-serif text-3xl tracking-wide text-foreground md:text-4xl">
              {card.title}
            </h3>
            <p className="max-w-[65ch] leading-[1.8] text-base text-muted-foreground md:text-lg">
              {card.longText}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function WhoIsSection() {
  const [selected, setSelected] = useState<(typeof whoIsData.cards)[0] | null>(null)

  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <SectionWrapper id="whois">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
          {whoIsData.subheading}
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
          {whoIsData.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {whoIsData.cards.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            onClick={() => setSelected(card)}
            className="group flex min-h-[240px] flex-col items-start gap-6 rounded-xl border border-border bg-card/50 p-8 text-left transition-all hover:border-foreground/20 hover:bg-card"
            aria-label={`Подробнее о ${card.title}`}
          >
            <div className="h-20 w-20 overflow-hidden rounded-full border border-border/60">
              <AssetImage
                src={card.image}
                alt={card.title}
                width={80}
                height={80}
                className="h-full w-full"
              />
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium tracking-wider uppercase text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.shortText}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <CardModal card={selected} onClose={handleClose} />
    </SectionWrapper>
  )
}
