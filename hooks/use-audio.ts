"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface AudioState {
  enabled: boolean
  volume: number
}

const STORAGE_KEY = "legend-audio-state"

function getInitialState(): AudioState {
  if (typeof window === "undefined") return { enabled: false, volume: 0.5 }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return { enabled: false, volume: 0.5 }
}

export function useAudio() {
  const [state, setState] = useState<AudioState>({ enabled: false, volume: 0.5 })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hydrated = useRef(false)

  useEffect(() => {
    setState(getInitialState())
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const setVolume = useCallback((vol: number) => {
    setState((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, vol)) }))
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol))
    }
  }, [])

  const toggleSound = useCallback(() => {
    setState((prev) => {
      const next = !prev.enabled
      if (audioRef.current) {
        if (next) {
          audioRef.current.volume = prev.volume
          audioRef.current.play().catch(() => {})
        } else {
          audioRef.current.pause()
        }
      }
      return { ...prev, enabled: next }
    })
  }, [])

  const playAudio = useCallback(
    (src: string, loop = false) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      const audio = new Audio(src)
      audio.volume = state.volume
      audio.loop = loop
      audioRef.current = audio
      if (state.enabled) {
        audio.play().catch(() => {})
      }
      return audio
    },
    [state.enabled, state.volume]
  )

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
  }, [])

  return {
    enabled: state.enabled,
    volume: state.volume,
    setVolume,
    toggleSound,
    playAudio,
    stopAudio,
  }
}
