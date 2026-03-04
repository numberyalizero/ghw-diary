"use client"

import { Button } from "@/components/ui/button"
import { Mic, Square, Trash2, Play, Pause } from "lucide-react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useRef, useState, useEffect } from "react"

interface VoiceRecorderProps {
  audioBlob: Blob | null
  audioDuration: number
  isRecording: boolean
  onStartRecording: () => Promise<void>
  onStopRecording: () => void
  onClearAudio: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VoiceRecorder({
  audioBlob,
  audioDuration,
  isRecording,
  onStartRecording,
  onStopRecording,
  onClearAudio,
}: VoiceRecorderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAudioUrl(null)
    }
  }, [audioBlob])

  function togglePlayback() {
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
    <div className="flex flex-col gap-3">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="sr-only"
        />
      )}

      {!audioBlob && !isRecording && (
        <button
          type="button"
          onClick={onStartRecording}
          className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent hover:bg-accent/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {"Voice Memo"}
            </p>
            <p className="text-xs text-muted-foreground">
              {"Tap to record a voice note instead of typing"}
            </p>
          </div>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent/5 px-4 py-4">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute h-10 w-10 animate-ping rounded-full bg-accent/30" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Mic className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {"Recording..."}
            </p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {formatTime(audioDuration)}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={onStopRecording}
          >
            <Square className="h-4 w-4" />
            <span className="sr-only">{"Stop recording"}</span>
          </Button>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full text-foreground hover:bg-secondary"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          <div className="flex flex-1 flex-col gap-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: isPlaying ? "100%" : "0%" }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatTime(audioDuration)}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onClearAudio}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{"Delete recording"}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
