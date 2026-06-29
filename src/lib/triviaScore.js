import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

// 排行榜用：每個孩子的分數存在 triviaScores/{uid}（可被其他人讀，用來排名）。
// 不顯示真名 —— 用 uid 穩定對應一個動物暱稱 + 頭像。

const ANIMALS = [
  { e: "🦊", n: "小狐狸" }, { e: "🐯", n: "小老虎" }, { e: "🐰", n: "存錢兔" }, { e: "🦉", n: "貓頭鷹" },
  { e: "🐼", n: "熊貓老闆" }, { e: "🐢", n: "烏龜" }, { e: "🐝", n: "小蜜蜂" }, { e: "🐧", n: "企鵝商人" },
  { e: "🦁", n: "小獅子" }, { e: "🐨", n: "無尾熊" }, { e: "🐙", n: "章魚博士" }, { e: "🦄", n: "獨角獸" },
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function triviaIdentity(uid) {
  const a = ANIMALS[hash(uid) % ANIMALS.length];
  const num = (hash(uid + "x") % 90) + 10; // 10–99，降低同名機率
  return { avatar: a.e, nickname: `${a.n} ${num}` };
}

// 本週的 key（以週一為界，每週一重置）
export function weekKey(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0 = 週一
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

// 玩完一局：累加本週分數（跨週自動重置）
export async function writeTriviaScore(uid, roundPts) {
  if (!uid) return;
  const wk = weekKey();
  const ref = doc(db, "triviaScores", uid);
  const snap = await getDoc(ref);
  const prev = snap.exists() ? snap.data() : null;
  const weekly = prev && prev.weekKey === wk ? (prev.weeklyPoints || 0) + roundPts : roundPts;
  const id = triviaIdentity(uid);
  await setDoc(
    ref,
    {
      uid,
      nickname: id.nickname,
      avatar: id.avatar,
      weekKey: wk,
      weeklyPoints: weekly,
      allTimePoints: (prev?.allTimePoints || 0) + roundPts,
      bestRound: Math.max(prev?.bestRound || 0, roundPts),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// 抓本週排行榜（讀本週所有分數，前端排序，避免要建複合索引）
export async function fetchWeeklyLeaderboard(limitN = 50) {
  const wk = weekKey();
  const q = query(collection(db, "triviaScores"), where("weekKey", "==", wk));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data())
    .filter((r) => (r.weeklyPoints || 0) > 0)
    .sort((a, b) => (b.weeklyPoints || 0) - (a.weeklyPoints || 0))
    .slice(0, limitN);
}

// 抓總排行榜（不分週，讀全部分數依累積總分排序）
export async function fetchAllTimeLeaderboard(limitN = 50) {
  const snap = await getDocs(collection(db, "triviaScores"));
  return snap.docs
    .map((d) => d.data())
    .filter((r) => (r.allTimePoints || 0) > 0)
    .sort((a, b) => (b.allTimePoints || 0) - (a.allTimePoints || 0))
    .slice(0, limitN);
}
