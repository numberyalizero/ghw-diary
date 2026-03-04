"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BodySensationSection } from "./body-sensation-section"
import { WearableDataSection } from "./wearable-data-section"
import { ImageUpload } from "./image-upload"
import { VoiceRecorder } from "./voice-recorder"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { saveEntry } from "@/lib/diary-store"
import { toast } from "sonner"
import { Send, Sparkles } from "lucide-react"

interface DiaryFormProps {
  onEntrySaved: () => void
}

export function DiaryForm({ onEntrySaved }: DiaryFormProps) {
  const [bodySensation, setBodySensation] = useState("")
  const [wearableData, setWearableData] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    isRecording,
    audioBlob,
    audioDuration,
    startRecording,
    stopRecording,
    clearAudio,
  } = useAudioRecorder()

  const canSubmit = bodySensation.trim().length > 0 || wearableData.trim().length > 0 || audioBlob !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    try {
      // 把文字/图片/音频真正保存到 Firebase（Firestore + Storage）
      await saveEntry({
        bodySensation,
        wearableData,
        image: imageFile,
        audioBlob: audioBlob,
        audioDuration,
      })

      // 重置表单
      setBodySensation("")
      setWearableData("")
      setImageFile(null)
      clearAudio()

      toast.success("Entry saved", {
        description: "Your body sensation log has been recorded.",
      })

      onEntrySaved()
    } catch (error) {
      console.error("Save entry failed:", error)
      toast.error("保存失败", {
        description: "和服务器通信时出错，请稍后再试。",
      })
    } finally {
      // 无论成功还是失败，都停止“转圈”
      setIsSubmitting(false)
    }
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-normal text-foreground">
          {"Today's Log"}
        </h1>
        <p className="text-sm text-muted-foreground">{dateStr}</p>
      </div>

      <BodySensationSection value={bodySensation} onChange={setBodySensation} />

      <Separator className="bg-border" />

      <WearableDataSection value={wearableData} onChange={setWearableData} />

      <Separator className="bg-border" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {"More Ways to Log"}
          </h3>
        </div>
        <ImageUpload file={imageFile} onFileChange={setImageFile} />
        <VoiceRecorder
          audioBlob={audioBlob}
          audioDuration={audioDuration}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onClearAudio={clearAudio}
        />
      </div>

      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {"Saving..."}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {"Save Today's Log"}
          </span>
        )}
      </Button>
    </form>
  )
}
