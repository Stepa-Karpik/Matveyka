"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { CompareSlider } from "./compare-slider"
import { multiverseData } from "@/lib/site-data"

export function MultiverseSection() {
  return (
    <SectionWrapper id="multiverse">
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">
          {multiverseData.subheading}
        </p>
        <h2 className="font-serif text-3xl tracking-wide text-foreground md:text-5xl">
          {multiverseData.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {multiverseData.cards.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="rounded-xl border border-border/70 bg-card/40 p-5"
          >
            <h3 className="mb-4 text-center text-sm tracking-[0.2em] uppercase text-foreground">
              {card.title}
            </h3>

            <CompareSlider
              realImage={card.realImage}
              aiImage={card.aiImage}
              title={card.title}
            />

            <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
              {card.caption}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
