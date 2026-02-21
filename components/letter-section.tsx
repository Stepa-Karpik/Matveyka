"use client"

import { useRef, useCallback, useState } from "react"
import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { letterData } from "@/lib/site-data"

export function LetterSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScrolling, setAutoScrolling] = useState(false)
  const animationRef = useRef<number | null>(null)

  const toggleAutoScroll = useCallback(() => {
    if (autoScrolling) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      setAutoScrolling(false)
      return
    }

    setAutoScrolling(true)
    const speed = 0.5 // px per frame

    function step() {
      window.scrollBy(0, speed)
      animationRef.current = requestAnimationFrame(step)
    }
    animationRef.current = requestAnimationFrame(step)
  }, [autoScrolling])

  return (
    <SectionWrapper id="letter">
      <div ref={containerRef} className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
            {letterData.heading}
          </h2>
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
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
    </SectionWrapper>
  )
}
