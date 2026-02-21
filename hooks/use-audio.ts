"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface AudioState {
  enabled: boolean
  volume: number // 0..100
}

const STORAGE_KEY = "legend-audio-state"
const AUDIO_ENABLED_KEY = "audioEnabled"
const INTRO_TRACK_SRC = "/sounds/intro.mp3"

let sharedAudio: HTMLAudioElement | null = null
let sharedAudioContext: AudioContext | null = null

function clampVolume(volume: number) {
  return Math.max(0, Math.min(100, volume))
}

function getInitialState(): AudioState {
  if (typeof window === "undefined") return { enabled: false, volume: 55 }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AudioState>
      return {
        enabled: Boolean(parsed.enabled),
        volume: clampVolume(Number(parsed.volume ?? 55)),
      }
    }

    const legacyEnabled = localStorage.getItem(AUDIO_ENABLED_KEY) === "true"
    return { enabled: legacyEnabled, volume: 55 }
  } catch {
    return { enabled: false, volume: 55 }
  }
}

async function resumeAudioContext() {
  if (typeof window === "undefined") return

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextCtor()
  }

  if (sharedAudioContext.state === "suspended") {
    await sharedAudioContext.resume()
  }
}

function ensureSharedAudio(src: string) {
  if (!sharedAudio) {
    sharedAudio = new Audio(src)
    sharedAudio.loop = true
    sharedAudio.preload = "auto"
    return sharedAudio
  }

  const currentPath = sharedAudio.src ? new URL(sharedAudio.src).pathname : ""
  if (currentPath !== src) {
    sharedAudio.pause()
    sharedAudio.src = src
    sharedAudio.load()
  }

  sharedAudio.loop = true
  return sharedAudio
}

export function useAudio() {
  const [state, setState] = useState<AudioState>({ enabled: false, volume: 55 })
  const stateRef = useRef(state)
  const hydrated = useRef(false)

  useEffect(() => {
    const initial = getInitialState()
    stateRef.current = initial
    setState(initial)
    hydrated.current = true
  }, [])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (!hydrated.current) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      localStorage.setItem(AUDIO_ENABLED_KEY, state.enabled ? "true" : "false")
    } catch {
      // ignore
    }
  }, [state])

  const setVolume = useCallback((volume: number) => {
    const next = clampVolume(volume)
    setState((prev) => ({ ...prev, volume: next }))

    if (sharedAudio) {
      sharedAudio.volume = next / 100
    }
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, enabled }))

    if (enabled && !sharedAudio) {
      sharedAudio = ensureSharedAudio(INTRO_TRACK_SRC)
    }

    if (!sharedAudio) return

    if (enabled) {
      sharedAudio.volume = stateRef.current.volume / 100
      sharedAudio.play().catch(() => {})
    } else {
      sharedAudio.pause()
    }
  }, [])

  const toggleSound = useCallback(() => {
    setEnabled(!stateRef.current.enabled)
  }, [setEnabled])

  const startIntroAudio = useCallback(async (restart = false) => {
    try {
      await resumeAudioContext()
    } catch {
      // ignore
    }

    const audio = ensureSharedAudio(INTRO_TRACK_SRC)
    audio.volume = stateRef.current.volume / 100

    if (restart) {
      audio.currentTime = 0
    }

    await audio.play().catch(() => {})
    setState((prev) => ({ ...prev, enabled: true }))
  }, [])

  const stopAudio = useCallback((resetPosition = false) => {
    if (!sharedAudio) return

    sharedAudio.pause()
    if (resetPosition) {
      sharedAudio.currentTime = 0
    }
  }, [])

  return {
    enabled: state.enabled,
    volume: state.volume,
    setVolume,
    setEnabled,
    toggleSound,
    startIntroAudio,
    stopAudio,
  }
}
