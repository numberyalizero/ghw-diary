"use client"

import { useState, useRef, useCallback } from "react"

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  audioDuration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearAudio: () => void
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioDuration, setAudioDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      startTimeRef.current = Date.now()
      setAudioDuration(0)

      timerRef.current = setInterval(() => {
        setAudioDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      console.error("Microphone access denied")
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setAudioDuration(finalDuration)
    }
  }, [isRecording])

  const clearAudio = useCallback(() => {
    setAudioBlob(null)
    setAudioDuration(0)
  }, [])

  return {
    isRecording,
    audioBlob,
    audioDuration,
    startRecording,
    stopRecording,
    clearAudio,
  }
}
