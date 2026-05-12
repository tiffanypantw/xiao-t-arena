/**
 * useAdminContent — admin 端寫入 Firestore content 的 mutation hooks
 *
 * 寫完會 invalidate TanStack Query cache，讓學員端 & 其他 admin tab 立刻看到新值。
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ============================================================================
// useUpsertWeek — 新增或更新一個 week doc
// ============================================================================
export function useUpsertWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ weekNumber, data, isNew = false }) => {
      const ref = doc(db, "weeks", String(weekNumber));

      const payload = {
        ...data,
        weekNumber: Number(weekNumber),
        updatedAt: serverTimestamp(),
      };
      if (isNew) {
        payload.createdAt = serverTimestamp();
        // 預設 publishedAt 在第一次 published=true 時設定
        if (data.published) payload.publishedAt = serverTimestamp();
      } else if (data.published && data.publishedAt == null) {
        // 從未發佈過、現在第一次按 published
        payload.publishedAt = serverTimestamp();
      }

      await setDoc(ref, payload, { merge: true });
      return { weekNumber, ...payload };
    },
    onSuccess: async (_data, vars) => {
      // 強制立刻重新抓資料，而不只是 mark as stale
      // 這樣下次 navigate 到其他頁立刻看到新值
      await qc.refetchQueries({ queryKey: ["weeks"], type: "all" });
      await qc.refetchQueries({
        queryKey: ["weeks", Number(vars.weekNumber)],
        type: "all",
      });
    },
  });
}

// ============================================================================
// useCheckWeekExists — 新增前檢查 weekNumber 是否已被佔用
// ============================================================================
export async function checkWeekExists(weekNumber) {
  const snap = await getDoc(doc(db, "weeks", String(weekNumber)));
  return snap.exists();
}
