"use client"

import { Textarea } from "@/components/ui/textarea"
import { Heart } from "lucide-react"

interface BodySensationSectionProps {
  value: string
  onChange: (value: string) => void
}

export function BodySensationSection({ value, onChange }: BodySensationSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
          <Heart className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {"Body Sensation"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {"How does your body actually feel right now?"}
          </p>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your fatigue, energy levels, aches..."
        className="min-h-[120px] resize-none rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
      />
    </section>
  )
}
