"use client"

import { getEntries } from "@/lib/diary-store"
import { EntryCard } from "./entry-card"
import { ClipboardList } from "lucide-react"
import type { DiaryEntry } from "@/lib/types"

interface HistoryFeedProps {
  entries: DiaryEntry[]
}

export function HistoryFeed({ entries }: HistoryFeedProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ClipboardList className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">
            {"No entries yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {"Start logging your body sensations and health data"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-serif text-xl text-foreground">
        {"History"}
      </h2>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
