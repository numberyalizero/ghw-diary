import type { DiaryEntry, UserSettings, DiaryPayload } from "./types"
import { db, storage } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const ENTRIES_COLLECTION = "diaryEntries"
const SETTINGS_KEY = "bodylog-settings"

// NOTE: 原来这里用 localStorage 做“假数据库”，
// 现在我们改为：文字和元数据存到 Firestore，图片/音频存到 Firebase Storage。

// 从 Firestore 读取所有日记
export async function getEntries(): Promise<DiaryEntry[]> {
  // 在 Next.js 里，确保只在浏览器端调用（客户端组件）
  if (typeof window === "undefined") return []

  // diaryEntries 集合，按 createdAt 倒序
  const q = query(collection(db, ENTRIES_COLLECTION), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  const entries: DiaryEntry[] = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      date: data.date,
      bodySensation: data.bodySensation ?? "",
      wearableData: data.wearableData ?? "",
      imageUrl: data.imageUrl,
      imageName: data.imageName,
      audioUrl: data.audioUrl,
      audioDuration: data.audioDuration ?? undefined,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
    }
  })

  return entries
}

// 保存一条日记：
// 1. 如有图片，先上传到 Storage，拿到下载链接
// 2. 如有音频，同样上传到 Storage
// 3. 把文字 + 图片/音频链接 一起写入 Firestore
export async function saveEntry(payload: DiaryPayload): Promise<DiaryEntry> {
  const now = new Date()
  const dateIso = now.toISOString()

  let imageUrl: string | undefined
  let imageName: string | undefined
  if (payload.image) {
    // 每条记录使用一个唯一文件名，避免覆盖
    const imagePath = `images/${now.getTime()}-${payload.image.name}`
    const imageRef = ref(storage, imagePath)
    await uploadBytes(imageRef, payload.image)
    imageUrl = await getDownloadURL(imageRef)
    imageName = payload.image.name
  }

  let audioUrl: string | undefined
  if (payload.audioBlob) {
    const audioPath = `audio/${now.getTime()}.webm`
    const audioRef = ref(storage, audioPath)
    await uploadBytes(audioRef, payload.audioBlob)
    audioUrl = await getDownloadURL(audioRef)
  }

  const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
    date: dateIso,
    bodySensation: payload.bodySensation,
    wearableData: payload.wearableData,
    imageUrl,
    imageName,
    audioUrl,
    audioDuration: payload.audioDuration ?? null,
    createdAt: serverTimestamp(),
  })

  const entry: DiaryEntry = {
    id: docRef.id,
    date: dateIso,
    bodySensation: payload.bodySensation,
    wearableData: payload.wearableData,
    imageUrl,
    imageName,
    audioUrl,
    audioDuration: payload.audioDuration,
    createdAt: dateIso,
  }

  return entry
}

export function getSettings(): UserSettings {
  if (typeof window === "undefined") {
    return { notificationTime: "morning", onboardingComplete: false, userName: "" }
  }
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return { notificationTime: "morning", onboardingComplete: false, userName: "" }
  try {
    return JSON.parse(raw) as UserSettings
  } catch {
    return { notificationTime: "morning", onboardingComplete: false, userName: "" }
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
