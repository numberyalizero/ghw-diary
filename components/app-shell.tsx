"use client"

import { useState, useEffect, useCallback } from "react"
import { BottomNav, type AppView } from "./layout/bottom-nav"
import { DiaryForm } from "./diary/diary-form"
import { HistoryFeed } from "./history/history-feed"
import { SettingsPanel } from "./settings/settings-panel"
import { OnboardingScreen } from "./onboarding/onboarding-screen"
import { getSettings, getEntries } from "@/lib/diary-store"
import type { DiaryEntry } from "@/lib/types"

export function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>("diary")
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    // 初始化：读取本地设置 + 从 Firestore 拉取历史日记
    const init = async () => {
      const settings = getSettings()
      setIsOnboarded(settings.onboardingComplete)
      const loadedEntries = await getEntries()
      setEntries(loadedEntries)
    }
    void init()
  }, [])

  const refreshEntries = useCallback(() => {
    const reload = async () => {
      const loadedEntries = await getEntries()
      setEntries(loadedEntries)
    }
    void reload()
  }, [])

  function handleOnboardingComplete() {
    setIsOnboarded(true)
  }

  function handleEntrySaved() {
    refreshEntries()
    // Switch to history after short delay so user sees their new entry
    setTimeout(() => setCurrentView("history"), 600)
  }

  // Show nothing until we know onboarding status
  if (isOnboarded === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  const settings = getSettings()

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Main content area */}
      <main className="mx-auto w-full max-w-lg flex-1 px-5 pb-24 pt-12">
        {currentView === "diary" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {"Hello, "}{settings.userName}
            </p>
            <DiaryForm onEntrySaved={handleEntrySaved} />
          </div>
        )}

        {currentView === "history" && (
          <HistoryFeed entries={entries} />
        )}

        {currentView === "settings" && (
          <SettingsPanel onBack={() => setCurrentView("diary")} />
        )}
      </main>

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  )
}
