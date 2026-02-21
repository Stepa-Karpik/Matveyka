"use client"

import { useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { memeData } from "@/lib/site-data"

export function MemeGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = scrollRef.current
      if (!el) return
      const amount = el.clientWidth * 0.7
      el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
      setTimeout(updateScrollState, 400)
    },
    [updateScrollState]
  )

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
        {/* Navigation arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/90 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            aria-label="Прокрутить влево"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/90 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            aria-label="Прокрутить вправо"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {memeData.memes.map((meme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-shrink-0 snap-center"
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
    </SectionWrapper>
  )
}
