import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

// === 概念競技場 gating ===
//
// 規則：在「gating 上線時間」之前就建立的帳號 = 已訂閱者，自動通行（無痛轉移）。
// 之後新建立的帳號才需要開通碼。已通過開通的帳號會被標記 arenaAccess: true。
//
// ⚠️ 部署前把下面這個日期改成你「正式開啟 gating」的日期。
// 在這個時間點之前建立的帳號都算已訂閱、直接放行。
export const ARENA_GATING_LAUNCH = new Date("2026-06-23T00:00:00+08:00");

export function hasArenaAccess(userData) {
  if (!userData) return false;
  if (userData.arenaAccess === true) return true;

  const c = userData.createdAt;
  if (!c) return true; // 舊帳號沒有 createdAt → 視為已訂閱，放行

  let ms;
  if (typeof c?.toMillis === "function") ms = c.toMillis();
  else if (c?.seconds != null) ms = c.seconds * 1000;
  else ms = Date.parse(c);

  if (isNaN(ms)) return true;
  return ms < ARENA_GATING_LAUNCH.getTime();
}

// 兌換開通碼：沿用 redeemCodes collection，type 標記為 "arena-access"。
// 單次碼 = maxUses 設為 1（你在 Console 建碼時設定）。
export async function redeemArenaCode(uid, rawCode) {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { success: false, error: "請輸入開通碼" };
  if (!uid) return { success: false, error: "尚未登入" };

  const codeRef = doc(db, "redeemCodes", code);
  const userRef = doc(db, "users", uid);

  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(codeRef);
      if (!snap.exists()) throw new Error("查無此開通碼");
      const data = snap.data();
      if (data.type !== "arena-access") throw new Error("這不是概念競技場的開通碼");
      const uses = data.uses || 0;
      const maxUses = data.maxUses || 1;
      if (uses >= maxUses) throw new Error("這組開通碼已經被使用過了");

      tx.update(codeRef, { uses: uses + 1 });
      tx.set(
        userRef,
        { arenaAccess: true, arenaAccessAt: serverTimestamp(), arenaAccessCode: code },
        { merge: true }
      );
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "開通失敗，請再試一次" };
  }
}
