"use client"

interface AudioControlsProps {
  enabled: boolean
  volume: number
  onToggle: () => void
  onVolumeChange: (v: number) => void
}

export function AudioControls({
  enabled,
  volume,
  onToggle,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
        aria-label={enabled ? "Выключить звук" : "Включить звук"}
      >
        {enabled ? "Вкл" : "Выкл"}
      </button>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
        className="h-1.5 w-16 cursor-pointer accent-foreground md:w-20"
        aria-label="Громкость от 0 до 100"
      />
    </div>
  )
}
