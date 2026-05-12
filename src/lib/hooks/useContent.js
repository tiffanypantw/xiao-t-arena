/**
 * useContent — 各種讀取 Firestore brand content 的 TanStack Query hooks
 *
 * 全部用 5 分鐘 staleTime（內容不常變），重點是 cache 在 query client 裡
 * 跨頁切換不會重打。Admin 編輯後可以 invalidate query 來強制 refetch。
 */

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const STALE = 5 * 60 * 1000; // 5 min

// ============================================================================
// useWeeks — 所有 published weeks，照 weekNumber 排序
// ============================================================================
export function useWeeks() {
  return useQuery({
    queryKey: ["weeks"],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, "weeks"), orderBy("weekNumber"))
      );
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    staleTime: STALE,
  });
}

// ============================================================================
// useWeek(weekNumber) — 單一 week
// ============================================================================
export function useWeek(weekNumber) {
  return useQuery({
    queryKey: ["weeks", weekNumber],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "weeks", String(weekNumber)));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    },
    enabled: weekNumber != null && !Number.isNaN(weekNumber),
    staleTime: STALE,
  });
}

// ============================================================================
// useRewards — 全部 reward 的 map { rewardId: data }
// ============================================================================
export function useRewards() {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "rewards"));
      const result = {};
      snap.docs.forEach((d) => {
        result[d.id] = { id: d.id, ...d.data() };
      });
      return result;
    },
    staleTime: STALE,
  });
}

// ============================================================================
// useReward(rewardId) — 單一 reward（讀取單張徽章/卡片時用）
// ============================================================================
export function useReward(rewardId) {
  return useQuery({
    queryKey: ["rewards", rewardId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "rewards", rewardId));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    },
    enabled: !!rewardId,
    staleTime: STALE,
  });
}
