import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
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

  // 建立新進度文件
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

    // metadata
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
// 後台用函式
// ==================

// 取得所有待發放徽章的記錄
// Week 1-4：練習題全對但還沒發徽章
// Week 5+：開放題已提交但老師還沒看
export const getPendingBadges = async () => {
  const results = [];

  // Week 1-4：quizCompleted = true, badgeEarned = false
  const q1 = query(
    collection(db, "weeklyProgress"),
    where("quizCompleted", "==", true),
    where("badgeEarned", "==", false),
    where("weekNumber", "<=", 4)
  );
  const snap1 = await getDocs(q1);
  snap1.docs.forEach((d) => results.push({ id: d.id, ...d.data() }));

  // Week 5+：openAnswerSubmittedAt != null, openAnswerSeenAt = null
  const q2 = query(
    collection(db, "weeklyProgress"),
    where("openAnswerSubmittedAt", "!=", null),
    where("openAnswerSeenAt", "==", null)
  );
  const snap2 = await getDocs(q2);
  snap2.docs.forEach((d) => results.push({ id: d.id, ...d.data() }));

  return results;
};

// 審核開放題（老師看見）
export const approveOpenAnswer = async (progressId, encouragementMessage) => {
  // 1) 先讀取這筆紀錄，拿到 userId 跟 weekNumber
  const ref = doc(db, "weeklyProgress", progressId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("找不到該筆進度紀錄");
  const { userId, weekNumber } = snap.data();

  // 2) 更新 weeklyProgress（原本就有的邏輯）
  await updateDoc(ref, {
    openAnswerSeenAt: serverTimestamp(),
    encouragementMessage,
    badgeEarned: true,
    badgeEarnedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 3) 同步把徽章寫進 users.collection（讓學習護照看得到）
  const weekToBadge = {
    1: "badge-exchange-questioner",
    2: "badge-origin-seeker",
    3: "badge-value-discerner",
    4: "badge-cost-detective",
    5: "badge-need-decoder",
  };
  const badgeId = weekToBadge[weekNumber];
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

// 取得所有待審核的任務（taskApprovedAt === null）
export const getPendingTasks = async () => {
  const q = query(
    collection(db, "weeklyProgress"),
    where("taskSubmittedAt", "!=", null),
    where("taskApprovedAt", "==", null)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// 通過任務
export const approveTask = async (progressId, feedback, cardCode) => {
  const ref = doc(db, "weeklyProgress", progressId);
  await updateDoc(ref, {
    taskFeedback: feedback,
    taskCardCode: cardCode,
    taskApprovedAt: serverTimestamp(),
    cardEarned: true,
    cardEarnedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
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