"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveSettings } from "@/lib/diary-store"
import type { UserSettings } from "@/lib/types"
import { ArrowRight, Bell } from "lucide-react"

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [notificationTime, setNotificationTime] = useState("09:00")

  function handleFinish() {
    const settings: UserSettings = {
      notificationTime,
      onboardingComplete: true,
      userName: name.trim() || "User",
    }
    saveSettings(settings)
    onComplete()
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {step === 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-4xl text-foreground">
                BodyLog
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                {"Explore the relationship between how your body feels and what your data says. Log your real sensations daily, and compare them with your wearable insights."}
              </p>
            </div>
            <Button
              onClick={() => setStep(1)}
              className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span className="flex items-center gap-2">
                {"Get Started"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl text-foreground">
                {"What's your name?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {"Let us personalise the experience for you"}
              </p>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-12 rounded-xl border-border bg-card text-foreground"
              autoFocus
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span className="flex items-center gap-2">
                {"Continue"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl text-foreground">
                {"When do you want to log?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {"Set your preferred daily reminder time"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Label
                htmlFor="onboarding-time"
                className="flex items-center gap-3 rounded-xl border border-accent bg-accent/5 px-4 py-4"
              >
                <Bell className="h-5 w-5 text-accent" />
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{"Reminder Time"}</span>
                  <span className="text-xs text-muted-foreground">{"You'll get a daily nudge at this time"}</span>
                </div>
                <Input
                  id="onboarding-time"
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="h-10 w-28 rounded-lg border-border bg-card text-center text-foreground"
                />
              </Label>
            </div>

            <Button
              onClick={handleFinish}
              className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {"Finish Setup"}
            </Button>
          </div>
        )}

        {/* Step indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-accent" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
