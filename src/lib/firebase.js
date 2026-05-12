import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config 從環境變數讀取，per-brand 透過 .env.{brand}.local 切換
// Fallback 是中文 Tiffany 兒財品牌的 production 值（這些是 public，會 baked 進 client bundle）
// TODO: 等 Vercel 環境也都設好 VITE_FIREBASE_* env 變數後，移除這些 fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClH_4vqDUDZ5seyceBqRujbziXiIXOvYk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "xiao-t-arena.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "xiao-t-arena",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "xiao-t-arena.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "725895466930",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:725895466930:web:68f758568e8daaba9d5eab",
};

// Brand 識別（給未來 brand-specific 邏輯用，例如載入哪份 brand content）
export const BRAND = import.meta.env.VITE_BRAND || "tiffany";

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出各個服務實例
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);