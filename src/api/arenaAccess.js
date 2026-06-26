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

// === 每個主題課程各自一把鎖（per-theme gating）===
//
// 一個孩子解鎖過的主題存在 users/{uid}.unlockedThemes = { "l1-season1": true, ... }
// 既有的「第一季」(l1-season1)：上線前就存在的帳號、或已用過舊 arena-access 碼開通的，自動有。

export function hasThemeAccess(userData, themeId) {
  if (!userData || !themeId) return false;
  if (userData.unlockedThemes && userData.unlockedThemes[themeId] === true) return true;
  // 既有「第一季」grandfather：舊帳號 / 舊 arena-access 開通者 直接放行
  if (themeId === "l1-season1" && hasArenaAccess(userData)) return true;
  return false;
}

// 兌換「某個主題」的開通碼：redeemCodes 裡 type=theme-access、帶 themeId
export async function redeemThemeCode(uid, rawCode, expectedThemeId) {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { success: false, error: "請輸入開通碼" };
  if (!uid) return { success: false, error: "尚未登入" };

  const codeRef = doc(db, "redeemCodes", code);
  const userRef = doc(db, "users", uid);

  try {
    let unlockedThemeId = null;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(codeRef);
      if (!snap.exists()) throw new Error("查無此開通碼");
      const data = snap.data();
      if (data.type !== "theme-access") throw new Error("這不是主題課程的開通碼");
      if (!data.themeId) throw new Error("這組碼沒有對應的主題，請聯絡老師");
      if (expectedThemeId && data.themeId !== expectedThemeId) {
        throw new Error("這組碼不是這個主題的開通碼，請確認你買的是哪一個主題");
      }
      const uses = data.uses || 0;
      const maxUses = data.maxUses || 1;
      if (uses >= maxUses) throw new Error("這組開通碼已經被使用過了");

      tx.update(codeRef, { uses: uses + 1 });
      tx.set(
        userRef,
        { unlockedThemes: { [data.themeId]: true }, themesUpdatedAt: serverTimestamp() },
        { merge: true }
      );
      unlockedThemeId = data.themeId;
    });
    return { success: true, themeId: unlockedThemeId };
  } catch (e) {
    return { success: false, error: e.message || "開通失敗，請再試一次" };
  }
}
