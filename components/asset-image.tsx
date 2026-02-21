"use client"

import { useState } from "react"
import Image from "next/image"

interface AssetImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function AssetImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  priority = false,
}: AssetImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={`asset-placeholder ${className}`}
        role="img"
        aria-label={`Заглушка для ${alt}`}
      >
        <span className="text-muted-foreground text-xs tracking-widest uppercase">
          заглушка изображения
        </span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        onError={() => setError(true)}
        priority={priority}
        sizes="100vw"
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      priority={priority}
    />
  )
}
