import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClH_4vqDUDZ5seyceBqRujbziXiIXOvYk",
  authDomain: "xiao-t-arena.firebaseapp.com",
  projectId: "xiao-t-arena",
  storageBucket: "xiao-t-arena.firebasestorage.app",
  messagingSenderId: "725895466930",
  appId: "1:725895466930:web:68f758568e8daaba9d5eab",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出各個服務實例
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // 新增 Storage