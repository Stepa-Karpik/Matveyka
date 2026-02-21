"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { timelineData } from "@/lib/site-data"

export function TimelineSection() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <SectionWrapper id="timeline">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
          {timelineData.subheading}
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
          {timelineData.heading}
        </h2>
      </div>

      {/* Desktop: horizontal layout */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-6 left-0 right-0 h-[1px] bg-border" />

          <div className="grid" style={{ gridTemplateColumns: `repeat(${timelineData.events.length}, 1fr)` }}>
            {timelineData.events.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative flex flex-col items-center px-2"
              >
                {/* Dot */}
                <div className="relative z-10 mb-6 flex h-3 w-3 items-center justify-center">
                  <div className="h-3 w-3 rounded-full border border-foreground/40 bg-background" />
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-foreground/60" />
                </div>

                {/* Content */}
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex flex-col items-center text-center"
                  aria-expanded={expanded === i}
                  aria-label={`${event.year}: ${event.title}`}
                >
                  <span className="mb-1 font-serif text-lg tracking-wide text-foreground">
                    {event.year}
                  </span>
                  <span className="mb-1 text-xs font-medium tracking-wider uppercase text-foreground/80">
                    {event.title}
                  </span>
                  <span className="text-[11px] leading-relaxed text-muted-foreground">
                    {event.shortText}
                  </span>
                </button>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      {event.image && (
                        <div className="mb-3 aspect-video w-full max-w-[200px] overflow-hidden rounded-lg">
                          <AssetImage
                            src={event.image}
                            alt={event.title}
                            width={200}
                            height={112}
                            className="h-full w-full"
                          />
                        </div>
                      )}
                      <p className="max-w-[200px] text-[11px] leading-relaxed text-muted-foreground">
                        {event.longText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: vertical layout */}
      <div className="md:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-border" />

          <div className="flex flex-col gap-8">
            {timelineData.events.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-8 top-1 flex h-3 w-3 items-center justify-center">
                  <div className="h-3 w-3 rounded-full border border-foreground/40 bg-background" />
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-foreground/60" />
                </div>

                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex flex-col items-start text-left"
                  aria-expanded={expanded === i}
                  aria-label={`${event.year}: ${event.title}`}
                >
                  <span className="mb-0.5 font-serif text-lg tracking-wide text-foreground">
                    {event.year}
                  </span>
                  <span className="mb-0.5 text-xs font-medium tracking-wider uppercase text-foreground/80">
                    {event.title}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {event.shortText}
                  </span>
                </button>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      {event.image && (
                        <div className="mb-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg">
                          <AssetImage
                            src={event.image}
                            alt={event.title}
                            width={384}
                            height={216}
                            className="h-full w-full"
                          />
                        </div>
                      )}
                      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                        {event.longText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
