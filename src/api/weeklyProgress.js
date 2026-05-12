import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// 產生文件 ID
const getProgressId = (userId, weekNumber) =>
  `${userId}_week-${weekNumber}`;

// 取得或建立本週進度
export const getOrCreateProgress = async (userId, weekNumber) => {
  const id = getProgressId(userId, weekNumber);
  const ref = doc(db, "weeklyProgress", id);
  const snap = await getDoc(ref);

  if (snap.exists()) return { id, ...snap.data() };

  const newProgress = {
    userId,
    weekNumber,

    // 練習題區
    quizCompleted: false,
    quizCompletedAt: null,
    openAnswerContent: null,
    openAnswerSubmittedAt: null,
    openAnswerSeenAt: null,
    encouragementMessage: null,
    badgeEarned: false,
    badgeEarnedAt: null,

    // 任務區
    taskText: null,
    taskImageUrls: [],
    taskSubmittedAt: null,
    taskFeedback: null,
    taskCardCode: null,
    taskApprovedAt: null,
    taskRevealed: false,
    cardEarned: false,
    cardEarnedAt: null,

    // 對話區
    conversation: [],
    hasUnreadChildReply: false,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, newProgress);
  return { id, ...newProgress };
};

// 標記練習題完成
export const markQuizCompleted = async (userId, weekNumber) => {
  const id = getProgressId(userId, weekNumber);
  const ref = doc(db, "weeklyProgress", id);
  await updateDoc(ref, {
    quizCompleted: true,
    quizCompletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// 提交開放題
export const submitOpenAnswer = async (userId, weekNumber, content) => {
  const id = getProgressId(userId, weekNumber);
  const ref = doc(db, "weeklyProgress", id);
  await updateDoc(ref, {
    openAnswerContent: content,
    openAnswerSubmittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// 提交任務
export const submitTask = async (userId, weekNumber, taskText, taskImageUrls) => {
  const id = getProgressId(userId, weekNumber);
  const ref = doc(db, "weeklyProgress", id);
  await updateDoc(ref, {
    taskText,
    taskImageUrls,
    taskSubmittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// 揭曉禮物（孩子點開禮物）
export const revealTask = async (userId, weekNumber) => {
  const id = getProgressId(userId, weekNumber);
  const ref = doc(db, "weeklyProgress", id);
  await updateDoc(ref, {
    taskRevealed: true,
    updatedAt: serverTimestamp(),
  });
};

// ==================
// 對話功能
// ==================

// 孩子提交回應給老師
export const submitChildReply = async (progressId, content) => {
  if (!content || content.trim().length < 10) {
    throw new Error("回應內容至少要 10 個字");
  }

  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("找不到該筆進度紀錄");

  const existing = snap.data().conversation || [];
  const newEntry = {
    role: "child",
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };

  await updateDoc(ref, {
    conversation: [...existing, newEntry],
    hasUnreadChildReply: true,
    updatedAt: serverTimestamp(),
  });
};

// 老師寫新的回覆
export const submitTeacherReply = async (progressId, content) => {
  if (!content || content.trim().length < 30) {
    throw new Error("回覆至少要 30 個字");
  }

  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("找不到該筆進度紀錄");

  const existing = snap.data().conversation || [];
  const newEntry = {
    role: "teacher",
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };

  await updateDoc(ref, {
    conversation: [...existing, newEntry],
    hasUnreadChildReply: false,
    updatedAt: serverTimestamp(),
  });
};

// 撈所有有未讀孩子回應的對話
export const getPendingConversations = async () => {
  const q = query(
    collection(db, "weeklyProgress"),
    where("hasUnreadChildReply", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// 撈所有審核紀錄（給審核歷史頁面用）
export const getAllReviewHistory = async () => {
  // 撈所有已被審核過的紀錄
  const q = query(
    collection(db, "weeklyProgress"),
    where("taskApprovedAt", "!=", null)
  );
  const snap = await getDocs(q);
  // 在 JS 排序、避免要建複合索引
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });
};

// ==================
// 後台用函式
// ==================

// 取得所有待發放徽章的記錄
export const getPendingBadges = async () => {
  const results = [];
  const seenIds = new Set();

  // 路徑 1：所有「答對全部練習題、但徽章還沒拿到」的紀錄（W1-W4 + W6+ 沒有開放題的週次）
  const q1 = query(
    collection(db, "weeklyProgress"),
    where("quizCompleted", "==", true),
    where("badgeEarned", "==", false)
  );
  const snap1 = await getDocs(q1);
  snap1.docs.forEach((d) => {
    if (!seenIds.has(d.id)) {
      results.push({ id: d.id, ...d.data() });
      seenIds.add(d.id);
    }
  });

  // 路徑 2：W5（有開放題）— 開放題已提交但老師還沒看
  const q2 = query(
    collection(db, "weeklyProgress"),
    where("openAnswerSubmittedAt", "!=", null),
    where("openAnswerSeenAt", "==", null)
  );
  const snap2 = await getDocs(q2);
  snap2.docs.forEach((d) => {
    if (!seenIds.has(d.id)) {
      results.push({ id: d.id, ...d.data() });
      seenIds.add(d.id);
    }
  });

  return results;
};

// 審核開放題（老師看見）
export const approveOpenAnswer = async (progressId, encouragementMessage) => {
  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("找不到該筆進度紀錄");
  const { userId, weekNumber } = snap.data();

  await updateDoc(ref, {
    openAnswerSeenAt: serverTimestamp(),
    encouragementMessage,
    badgeEarned: true,
    badgeEarnedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 從 week doc 反查 badgeId（取代舊的 weekToBadge 對照表）
  const weekSnap = await getDoc(doc(db, "weeks", String(weekNumber)));
  const badgeId = weekSnap.exists() ? weekSnap.data().badgeId : null;

  if (badgeId && userId) {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        collection: {
          [badgeId]: {
            unlockedAt: new Date().toISOString(),
            source: "admin-review",
          },
        },
      },
      { merge: true }
    );
  }
};

// 取得所有待審核的任務（已提交但還沒審核）
export const getPendingTasks = async () => {
  const q = query(
    collection(db, "weeklyProgress"),
    where("taskApprovedAt", "==", null)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.taskSubmittedAt !== null && r.taskSubmittedAt !== undefined);
};

// 通過任務 → 同時寫進 users.collection 讓學習護照亮起卡片
export const approveTask = async (progressId, feedback, cardCode) => {
  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("找不到該筆進度紀錄");
  const { userId, weekNumber } = snap.data();

  // 同時把 feedback 寫進 conversation 陣列（變成對話起點）
  const firstMessage = {
    role: "teacher",
    content: feedback,
    timestamp: new Date().toISOString(),
  };

  await updateDoc(ref, {
    taskFeedback: feedback,
    taskCardCode: cardCode,
    taskApprovedAt: serverTimestamp(),
    cardEarned: true,
    cardEarnedAt: serverTimestamp(),
    conversation: [firstMessage],
    hasUnreadChildReply: false,
    updatedAt: serverTimestamp(),
  });

  // 從 week doc 反查 cardId（取代舊的 weekToCard 對照表）
  const weekSnap = await getDoc(doc(db, "weeks", String(weekNumber)));
  const cardId = weekSnap.exists() ? weekSnap.data().cardId : null;

  if (cardId && userId) {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        collection: {
          [cardId]: {
            unlockedAt: new Date().toISOString(),
            source: "admin-task-review",
          },
        },
      },
      { merge: true }
    );
  }
};

// 退回任務
export const rejectTask = async (progressId, rejectReason) => {
  const ref = doc(db, "weeklyProgress", progressId);
  await updateDoc(ref, {
    taskFeedback: rejectReason,
    taskText: null,
    taskImageUrls: [],
    taskSubmittedAt: null,
    updatedAt: serverTimestamp(),
  });
};

// 取得單一進度詳細
export const getProgressById = async (progressId) => {
  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};