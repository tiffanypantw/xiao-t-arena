import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// 5 個罐子的定義（顏色對齊 app / 紙本記帳本）
export const JARS = [
  { key: "hua", label: "花", job: "日常開銷", color: "#B25E1B", bg: "#FBE8DC" },
  { key: "cun", label: "存", job: "未來目標", color: "#9A7611", bg: "#FBF1D9" },
  { key: "xue", label: "學", job: "投資自己", color: "#1C7C4C", bg: "#E3F4EA" },
  { key: "tou", label: "投", job: "讓錢生錢", color: "#1B5FA0", bg: "#E2F0FB" },
  { key: "gei", label: "給", job: "分享他人", color: "#9C3F7E", bg: "#F8E8F2" },
];

export const jarOf = (key) => JARS.find((j) => j.key === key);

// 當前月份 key，例如 "2026-06"
export const currentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// 一個月的預設資料
export const defaultMonth = (monthKey) => ({
  monthKey,
  goals: { save: "", learn: "", invest: "", give: "" },
  allowance: 0,
  percents: { hua: 40, cun: 20, xue: 15, tou: 15, gei: 10 },
  entries: [],
});

// 資料存在每個孩子自己帳號底下的子集合：users/{uid}/bookkeeping/{monthKey}
const monthRef = (uid, monthKey) => doc(db, "users", uid, "bookkeeping", monthKey);

export const getMonth = async (uid, monthKey) => {
  const snap = await getDoc(monthRef(uid, monthKey));
  if (snap.exists()) return { ...defaultMonth(monthKey), ...snap.data() };
  return defaultMonth(monthKey);
};

export const saveMonth = async (uid, monthKey, data) => {
  await setDoc(
    monthRef(uid, monthKey),
    { ...data, monthKey, updatedAt: serverTimestamp() },
    { merge: true }
  );
};
