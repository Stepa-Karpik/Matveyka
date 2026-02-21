"use client"

import { motion } from "framer-motion"
import { AssetImage } from "./asset-image"
import { heroData } from "@/lib/site-data"

export function HeroSection() {
  const scrollToWhois = () => {
    const el = document.querySelector("#whois")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <AssetImage
          src={heroData.backgroundImage}
          alt="Фон главного экрана"
          fill
          priority
          className="scale-105"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2 }}
        >
          <p className="mb-4 text-xs tracking-[0.4em] uppercase text-muted-foreground">
            с {new Date().getFullYear() - heroData.friendshipYears} - дружбе{" "}
            {heroData.friendshipYears} лет
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="font-serif text-5xl leading-tight tracking-wide text-foreground md:text-7xl lg:text-9xl"
        >
          {heroData.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground md:text-base">
            {heroData.subtitle}
          </p>
          <p className="text-xs tracking-[0.2em] text-muted-foreground/60">
            {heroData.secondarySubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="pt-8"
        >
          <button
            onClick={scrollToWhois}
            className="border border-foreground/20 px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
            aria-label={heroData.cta}
          >
            {heroData.cta}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
