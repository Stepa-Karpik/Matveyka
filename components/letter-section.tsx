"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { letterData } from "@/lib/site-data"

const AUTO_SCROLL_PX_PER_SEC = 8

export function LetterSection() {
  const [autoScrolling, setAutoScrolling] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const stopAutoScroll = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    lastTimeRef.current = null
    setAutoScrolling(false)
  }, [])

  const startAutoScroll = useCallback(() => {
    const step = (timestamp: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = timestamp
      }

      const deltaMs = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      window.scrollBy(0, (deltaMs / 1000) * AUTO_SCROLL_PX_PER_SEC)
      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame(step)
    setAutoScrolling(true)
  }, [])

  const toggleAutoScroll = useCallback(() => {
    if (autoScrolling) {
      stopAutoScroll()
      return
    }
    startAutoScroll()
  }, [autoScrolling, startAutoScroll, stopAutoScroll])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <SectionWrapper id="letter">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
            {letterData.heading}
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6"
          >
            <button
              onClick={toggleAutoScroll}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              aria-label={autoScrolling ? "Остановить автопрокрутку" : "Читать медленно с автопрокруткой"}
            >
              {autoScrolling ? "Остановить прокрутку" : "Читать медленно"}
            </button>
          </motion.div>
        </div>

        <div className="mx-auto mb-10 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-border/70 bg-card/30">
          <AssetImage
            src={letterData.portrait}
            alt="Портрет"
            width={520}
            height={650}
            className="h-full w-full"
          />
        </div>

        <div className="flex flex-col gap-6">
          {letterData.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="font-serif text-base leading-relaxed text-foreground/80 md:text-lg"
              style={{ fontStyle: "italic" }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
