"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"
import { AssetImage } from "./asset-image"
import { memeData } from "@/lib/site-data"

export function MemeGallery() {
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

      <div className="overflow-hidden">
        <div className="meme-marquee">
          <div className="meme-marquee-track" aria-label="Лента мемов">
            {memeData.memes.map((meme, i) => (
              <motion.div
                key={`meme-a-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
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

          <div className="meme-marquee-track" aria-hidden="true">
            {memeData.memes.map((meme, i) => (
              <div key={`meme-b-${i}`} className="flex-shrink-0">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
