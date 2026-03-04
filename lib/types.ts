export interface DiaryEntry {
  id: string
  date: string
  bodySensation: string
  wearableData: string
  imageUrl?: string
  imageName?: string
  audioUrl?: string
  audioDuration?: number
  createdAt: string
}

export interface UserSettings {
  notificationTime: string
  onboardingComplete: boolean
  userName: string
}

export interface DiaryPayload {
  bodySensation: string
  wearableData: string
  image?: File | null
  audioBlob?: Blob | null
  audioDuration?: number
}
