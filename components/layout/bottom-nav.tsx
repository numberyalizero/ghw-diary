"use client"

import { PenLine, Clock, Settings } from "lucide-react"

export type AppView = "diary" | "history" | "settings"

interface BottomNavProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
}

const navItems: { view: AppView; label: string; icon: typeof PenLine }[] = [
  { view: "diary", label: "Log", icon: PenLine },
  { view: "history", label: "History", icon: Clock },
  { view: "settings", label: "Settings", icon: Settings },
]

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {navItems.map(({ view, label, icon: Icon }) => {
          const isActive = currentView === view
          return (
            <button
              key={view}
              role="tab"
              aria-selected={isActive}
              onClick={() => onViewChange(view)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
