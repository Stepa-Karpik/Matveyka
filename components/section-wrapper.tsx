"use client"

import { motion } from "framer-motion"
import { useIntersectionFade } from "@/hooks/use-intersection-fade"

interface SectionWrapperProps {
  id?: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  const { ref, isVisible } = useIntersectionFade(0.1)

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`relative px-6 py-24 md:py-32 lg:py-40 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </motion.section>
  )
}
