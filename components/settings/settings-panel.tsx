"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSettings, saveSettings } from "@/lib/diary-store"
import { Bell, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface SettingsPanelProps {
  onBack: () => void
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const [notificationTime, setNotificationTime] = useState("09:00")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const settings = getSettings()
    setNotificationTime(settings.notificationTime)
    setUserName(settings.userName)
  }, [])

  function handleSave() {
    saveSettings({
      notificationTime,
      onboardingComplete: true,
      userName,
    })
    toast.success("Settings saved")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">{"Back"}</span>
        </Button>
        <h1 className="font-serif text-2xl text-foreground">
          {"Settings"}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{"Reminder Time"}</h3>
          <p className="text-xs text-muted-foreground">
            {"Set the time you'd like to be reminded to log each day"}
          </p>
        </div>

        <Label
          htmlFor="settings-time"
          className="flex items-center gap-4 rounded-xl border border-accent bg-accent/5 px-4 py-4"
        >
          <Bell className="h-5 w-5 text-accent" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{"Daily Reminder"}</p>
            <p className="text-xs text-muted-foreground">{"We'll nudge you at this time"}</p>
          </div>
          <Input
            id="settings-time"
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="h-10 w-28 rounded-lg border-border bg-card text-center text-foreground"
          />
        </Label>
      </div>

      <Button
        onClick={handleSave}
        className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {"Save Settings"}
      </Button>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {"BodyLog is part of an anthropological research project exploring the tension between inner bodily sensations and external quantified data. Your data is stored locally on your device only."}
        </p>
      </div>
    </div>
  )
}
