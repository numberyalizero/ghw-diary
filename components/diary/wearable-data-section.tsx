"use client"

import { Textarea } from "@/components/ui/textarea"
import { Activity } from "lucide-react"

interface WearableDataSectionProps {
  value: string
  onChange: (value: string) => void
}

export function WearableDataSection({ value, onChange }: WearableDataSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {"Data Perspective"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {"What does your wearable / health app say today?"}
          </p>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Steps, heart rate, sleep score, calories..."
        className="min-h-[120px] resize-none rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
      />
    </section>
  )
}
