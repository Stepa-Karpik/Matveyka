"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { memeData } from "@/lib/site-data"

const AUTO_SCROLL_PX_PER_SEC = 44

export function MemeGallery() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const pausedRef = useRef(false)

  const loopedMemes = useMemo(() => [...memeData.memes, ...memeData.memes], [])

  const normalizePosition = useCallback(() => {
    const el = viewportRef.current
    if (!el) return

    const half = el.scrollWidth / 2
    if (half <= 0) return

    if (el.scrollLeft >= half) {
      el.scrollLeft -= half
    }

    if (el.scrollLeft < 0) {
      el.scrollLeft += half
    }
  }, [])

  useEffect(() => {
    const tick = (timestamp: number) => {
      const el = viewportRef.current
      if (lastTimeRef.current == null) {
        lastTimeRef.current = timestamp
      }

      const deltaMs = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      if (el && !pausedRef.current) {
        const deltaPx = (deltaMs / 1000) * AUTO_SCROLL_PX_PER_SEC
        el.scrollLeft += deltaPx
        normalizePosition()
      }
      animationRef.current = requestAnimationFrame(tick)
    }

    animationRef.current = requestAnimationFrame(tick)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      lastTimeRef.current = null
    }
  }, [normalizePosition])

  return (
    <SectionWrapper id="memes">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
          {memeData.subheading}
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
          {memeData.heading}
        </h2>
      </div>

      <div className="relative">
        <div
          ref={viewportRef}
          className="overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => {
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            pausedRef.current = false
          }}
          onPointerDown={() => {
            pausedRef.current = true
          }}
          onPointerUp={() => {
            pausedRef.current = false
          }}
          onPointerCancel={() => {
            pausedRef.current = false
          }}
        >
          <div className="flex w-max gap-4 pr-4">
            {loopedMemes.map((meme, i) => (
              <motion.div
                key={`${meme.src}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % memeData.memes.length) * 0.04, duration: 0.45 }}
                className="flex-shrink-0"
              >
                <div className="group relative w-64 overflow-hidden rounded-lg border border-border md:w-80">
                  <div className="aspect-square">
                    <AssetImage
                      src={meme.src}
                      alt={meme.caption}
                      width={320}
                      height={320}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 py-3">
                    <p className="text-[11px] tracking-[0.18em] text-white/90 drop-shadow-md">
                      {meme.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
