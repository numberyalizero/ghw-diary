"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

export function ImageUpload({ file, onFileChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    onFileChange(selected)
    if (selected) {
      const url = URL.createObjectURL(selected)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  function handleClear() {
    onFileChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload a health data screenshot"
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent hover:bg-accent/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Camera className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {"Upload Screenshot"}
            </p>
            <p className="text-xs text-muted-foreground">
              {"Capture or upload your health data screenshot"}
            </p>
          </div>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={preview}
            alt="Health data screenshot preview"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/60 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-card" />
              <span className="truncate text-xs text-card">
                {file?.name ?? "screenshot.png"}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-card hover:bg-card/20 hover:text-card"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{"Remove image"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
