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
            className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>

            <div className="mb-6 aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-lg">
              <AssetImage
                src={card.image}
                alt={card.title}
                width={200}
                height={200}
                className="h-full w-full"
              />
            </div>

            <h3 className="mb-2 font-serif text-2xl tracking-wide text-foreground">
              {card.title}
            </h3>
            <p className="leading-relaxed text-sm text-muted-foreground">{card.longText}</p>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {whoIsData.cards.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            onClick={() => setSelected(card)}
            className="group flex flex-col items-start gap-4 rounded-lg border border-border bg-card/50 p-6 text-left transition-all hover:border-foreground/20 hover:bg-card"
            aria-label={`Подробнее о ${card.title}`}
          >
            <div className="h-14 w-14 overflow-hidden rounded-full">
              <AssetImage
                src={card.image}
                alt={card.title}
                width={56}
                height={56}
                className="h-full w-full"
              />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium tracking-wider uppercase text-foreground">
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
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
