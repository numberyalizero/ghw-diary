"use client"

import { Heart, Activity, Image as ImageIcon, Mic, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DiaryEntry } from "@/lib/types"
import { useRef, useState } from "react"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface EntryCardProps {
  entry: DiaryEntry
}

export function EntryCard({ entry }: EntryCardProps) {
  const date = new Date(entry.date)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const dateLabel = date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  })
  const dayLabel = date.toLocaleDateString("en-GB", { weekday: "short" })
  const timeLabel = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })

  function toggleAudio() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors">
      {/* Date column */}
      <div className="flex w-12 shrink-0 flex-col items-center pt-0.5">
        <span className="text-xs font-medium text-muted-foreground">{dayLabel}</span>
        <span className="text-lg font-semibold text-foreground">{dateLabel}</span>
        <span className="text-[10px] text-muted-foreground">{timeLabel}</span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {entry.bodySensation && (
          <div className="flex gap-2">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-foreground">
              {entry.bodySensation}
            </p>
          </div>
        )}

        {entry.wearableData && (
          <div className="flex gap-2">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              {entry.wearableData}
            </p>
          </div>
        )}

        {entry.imageUrl && (
          <div className="flex flex-col gap-2 rounded-lg bg-secondary px-3 py-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-xs text-muted-foreground">
                {entry.imageName ?? "Screenshot"}
              </span>
            </div>
            <img
              src={entry.imageUrl}
              alt={entry.imageName ?? "Screenshot"}
              className="max-h-40 w-auto rounded-md border border-border object-cover"
            />
          </div>
        )}

        {entry.audioUrl && (
          <>
            <audio
              ref={audioRef}
              src={entry.audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="sr-only"
            />
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-full text-foreground"
                onClick={toggleAudio}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
              <Mic className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatTime(entry.audioDuration ?? 0)}
              </span>
            </div>
          </>
        )}
      </div>
    </article>
  )
}
