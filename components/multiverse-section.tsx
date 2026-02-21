"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { CompareSlider } from "./compare-slider"
import { multiverseData } from "@/lib/site-data"

export function MultiverseSection() {
  return (
    <SectionWrapper id="multiverse">
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
          {multiverseData.subheading}
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
          {multiverseData.heading}
        </h2>
      </div>

      {/* Comparison sliders */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {multiverseData.comparisons.map((comp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <CompareSlider
              realImage={comp.realImage}
              aiImage={comp.aiImage}
              realLabel={comp.realLabel}
              aiLabel={comp.aiLabel}
            />
          </motion.div>
        ))}
      </div>

      {/* Universe cards */}
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {multiverseData.universes.map((uni, i) => (
          <motion.div
            key={uni.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            className="group rounded-lg border border-border bg-card/30 p-6 text-center transition-all hover:border-foreground/20 hover:bg-card/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
          >
            <h3 className="mb-2 text-sm font-medium tracking-wider uppercase text-foreground">
              {uni.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {uni.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
