// Firebase 客户端初始化（只在浏览器端使用）
// 文档：https://firebase.google.com/docs/web/setup

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// 你的 Web 应用的 Firebase 配置
// （这些 key 在前端项目里本身就是公开的，不算“密码”，
//   真正的安全要靠 Firestore / Storage 的安全规则来控制）
const firebaseConfig = {
  apiKey: "AIzaSyDTOHAcQUwJ5JpCGRU8PMv88VtGsQbFEFc",
  authDomain: "ghw-diary.firebaseapp.com",
  projectId: "ghw-diary",
  storageBucket: "ghw-diary.firebasestorage.app",
  messagingSenderId: "465161365916",
  appId: "1:465161365916:web:8c05b0f4587abe6f598059",
}

// Next.js 在开发模式下会热重载，为了避免重复初始化，这里做一个判断
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// 导出 Firestore 和 Storage 实例，给其他文件使用
export const db = getFirestore(app)
export const storage = getStorage(app)

