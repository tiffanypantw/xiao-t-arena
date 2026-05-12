/**
 * Content Migration Seed
 * 把 hardcoded 內容 (WEEK_DATA / REWARDS / REDEEM_CODES / ENCOURAGEMENT_MESSAGES)
 * 寫進 Firestore，符合 SCHEMA.md 設計的結構。
 *
 * 兩個 entry point：
 *   - seedTiffany(): 完整中文兒財品牌內容（W1-W6 + 所有現存 reward + code）
 *   - seedNgfa():    NGFA 英文 placeholder seed（minimum 給 preview 用，Tiffany 之後 admin UI 補真實內容）
 *
 * 兩個都做 "merge: true"，重跑安全（不會覆蓋學員資料；只會 update brandContent collections）。
 */

import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { REWARDS, REDEEM_CODES, WEEKS } from "@/lib/redeemCodes";
import {
  ENCOURAGEMENT_MESSAGES_QUIZ,
  ENCOURAGEMENT_MESSAGES_OPEN,
} from "@/lib/admin-config";
import { WEEK_DATA } from "@/pages/WeekLearning";

// ============================================================================
// 共用 helper：寫 brandSettings/main
// ============================================================================

async function writeBrandSettings(settings) {
  await setDoc(
    doc(db, "brandSettings", "main"),
    { ...settings, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// ============================================================================
// 中文 Tiffany 兒財 brand：完整內容遷移
// ============================================================================

export async function seedTiffany(log = console.log) {
  const stats = { brandSettings: 0, weeks: 0, rewards: 0, redeemCodes: 0 };

  // ---- 1. brandSettings/main ----
  log("📋 寫入 brandSettings/main...");
  await writeBrandSettings({
    brandName: "小T 競技場",
    brandFullName: "小T的財商概念競技場",
    brandTagline: "每週一個大問題，讓孩子學會思考金錢與價值",
    teacherName: "Tiffany 老師",
    teacherEmoji: "👩‍🏫",
    locale: "zh-TW",

    logoUrl: "/icon-192.png",
    iconUrl: "/icon-192.png",
    themeColor: "#7c3aed",
    backgroundColor: "#f5f0eb",

    themeTokens: {
      primary: "262 80% 55%",
      secondary: "30 90% 55%",
      accent: "150 60% 45%",
      background: "260 30% 98%",
      foreground: "260 25% 12%",
    },

    latestAvailableWeek: 6,
    weeksPerQuarter: 13,

    features: {
      showRedeemCodes: true,
      showVDPractice: true,
      enableImageUpload: true,
      enableVideo: false,
    },

    encouragementMessages: {
      quiz: ENCOURAGEMENT_MESSAGES_QUIZ,
      open: ENCOURAGEMENT_MESSAGES_OPEN,
    },
  });
  stats.brandSettings = 1;
  log("  ✓ brandSettings 寫好");

  // ---- 2. weeks/{n} ----
  log("📚 寫入 weeks/...");
  const batch1 = writeBatch(db);
  for (const week of WEEKS) {
    const weekNumber = parseInt(week.id.replace("week", ""), 10);
    const data = WEEK_DATA[weekNumber];
    if (!data) {
      log(`  ⚠️ skip week${weekNumber}：WEEK_DATA 找不到對應資料`);
      continue;
    }

    // 從 reward metadata 拉 chapter（避免不同來源不一致）
    const badgeMeta = week.badgeId ? REWARDS[week.badgeId] : null;
    const chapter = badgeMeta?.chapter || "Ch.1";

    // 看看這週的 task 對應哪張卡片（透過已知 weeklyProgress.js 的對照邏輯反推）
    const weekToCard = {
      1: "card-exchange-bottleneck",
      2: "card-consensus-currency",
      3: "card-price-secret",
      4: "card-cost-truth",
      5: "card-need-decoder-seal",
      6: "card-scarcity-decoder-seal",
    };

    batch1.set(
      doc(db, "weeks", String(weekNumber)),
      {
        weekNumber,
        title: data.title,
        quarter: 1, // 中文版目前都在 Q1（你之後跨 quarter 可在 admin UI 改）
        chapter,
        question: data.question,
        hasQuiz: true,
        hasOpenQuestion: !!data.hasOpenQuestion,
        hasTask: true,
        videoUrl: null,
        videoCaption: null,
        quizQuestions: data.quizQuestions || [],
        openQuestion: data.openQuestion || null,
        openQuestionMinChars: 30,
        taskTitle: data.taskTitle || "本週任務",
        taskDescription: data.taskDescription || "",
        taskMinChars: 50,
        badgeId: week.badgeId || null,
        cardId: weekToCard[weekNumber] || null,
        published: true,
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    stats.weeks++;
  }
  await batch1.commit();
  log(`  ✓ ${stats.weeks} 個 week 寫好`);

  // ---- 3. rewards/{rewardId} ----
  log("🏅 寫入 rewards/...");
  const batch2 = writeBatch(db);
  for (const [rewardId, r] of Object.entries(REWARDS)) {
    // 推斷 earnedFromWeek 跟 earnedVia
    let earnedFromWeek = r.week || null;
    let earnedVia = "quiz-approval";
    if (r.type === "card") earnedVia = "task-approval";
    if (r.chapter === "Special") earnedVia = "redeem-code-only";

    batch2.set(
      doc(db, "rewards", rewardId),
      {
        rewardId,
        type: r.type,
        name: r.name,
        description: r.description,
        weekLabel: r.weekLabel || "",
        chapter: r.chapter || "",
        earnedFromWeek,
        earnedVia,
        image: r.image || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    stats.rewards++;
  }
  await batch2.commit();
  log(`  ✓ ${stats.rewards} 個 reward 寫好`);

  // ---- 4. redeemCodes/{code} ----
  log("🎟️  寫入 redeemCodes/...");
  // 注意：redeemCodes 有些已經被學員兌換過，doc 已存在且有 uses 計數
  // 用 merge:true + 只設不存在欄位避免覆蓋現有 uses
  const codeEntries = Object.entries(REDEEM_CODES);
  // Firestore batch 上限 500 個 op，這裡有 150+ 安全
  const batch3 = writeBatch(db);
  for (const [code, c] of codeEntries) {
    batch3.set(
      doc(db, "redeemCodes", code),
      {
        code,
        rewardId: c.rewardId,
        type: c.type,
        maxUses: c.maxUses,
        // uses 不寫入 — 已存在的 doc 保留現有 uses，不存在的 doc 預設為 0 由現有 RedeemModal 邏輯處理
        generatedFor: null,
        expiresAt: null,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    stats.redeemCodes++;
  }
  await batch3.commit();
  log(`  ✓ ${stats.redeemCodes} 個 redeem code 寫好`);

  log("");
  log(`✅ Tiffany seed 完成：${JSON.stringify(stats)}`);
  return stats;
}

// ============================================================================
// NGFA 英文 brand：minimum placeholder seed
// ============================================================================

export async function seedNgfa(log = console.log) {
  const stats = { brandSettings: 0, weeks: 0, rewards: 0 };

  // ---- 1. brandSettings/main ----
  log("📋 寫入 NGFA brandSettings/main...");
  await writeBrandSettings({
    brandName: "NGFA Arena",
    brandFullName: "Next Gen Finance Academy",
    brandTagline:
      "Reflective learning for kids — where teachers actually read what your child writes",
    teacherName: "Tiffany",
    teacherEmoji: "👩‍🏫",
    locale: "en-US",

    logoUrl: "/icon-192.png",
    iconUrl: "/icon-192.png",
    themeColor: "#7c3aed",
    backgroundColor: "#f5f0eb",

    themeTokens: {
      primary: "262 80% 55%",
      secondary: "30 90% 55%",
      accent: "150 60% 45%",
      background: "260 30% 98%",
      foreground: "260 25% 12%",
    },

    latestAvailableWeek: 1,
    weeksPerQuarter: 13,

    features: {
      showRedeemCodes: false, // NGFA 起步不用兌換碼
      showVDPractice: false, // 無 live event
      enableImageUpload: true,
      enableVideo: true, // NGFA 開影片 embed
    },

    encouragementMessages: {
      quiz: [
        "You got them all — I can see you've been thinking carefully 📖",
        "Ten in a row. Your judgment is getting sharper 💪",
        "You're not rushing, you're seeing 🌱",
        "Right answers don't come from luck — you really got it ✨",
        "You stayed with it. That matters 🧡",
      ],
      open: [
        "Your observation is thoughtful ✨",
        "That's a connection I hadn't considered 🔗",
        "You're noticing what others miss 👀",
        "I'll be thinking about this all day 💭",
        "Can't wait to see what you observe next week 🌈",
      ],
    },
  });
  stats.brandSettings = 1;
  log("  ✓ brandSettings 寫好");

  // ---- 2. weeks/1（placeholder） ----
  log("📚 寫入 NGFA weeks/1 placeholder...");
  await setDoc(
    doc(db, "weeks", "1"),
    {
      weekNumber: 1,
      title: "Week 1",
      quarter: 1,
      chapter: "Ch.1",
      question: "Would the world be fairer without money?",
      hasQuiz: true,
      hasOpenQuestion: false,
      hasTask: true,
      videoUrl: null,
      videoCaption: null,
      quizQuestions: [
        {
          id: 1,
          block: "Basic Understanding",
          type: "multiple_choice",
          question:
            "Sam trades his comic book for his friend's cookies. This is closest to:",
          options: ["Using money", "Barter", "Borrowing", "Investing"],
          answer: "Barter",
          explanation: "Trading items directly for items is called barter.",
        },
        {
          id: 2,
          block: "Basic Understanding",
          type: "multiple_choice",
          question:
            "If you wanted apples but the apple seller only wanted shoes, what problem does that show?",
          options: [
            "Too many people want apples",
            "The double coincidence problem — both sides have to want what the other has",
            "Apples are too cheap",
            "There's no market",
          ],
          answer:
            "The double coincidence problem — both sides have to want what the other has",
          explanation:
            "For barter to work, both people need to want what the other has — that's hard to line up.",
        },
      ],
      openQuestion: null,
      openQuestionMinChars: 30,
      taskTitle: "This week's task",
      taskDescription:
        "🎯 Find 3 examples of exchange (with or without money) around you this week. For each, answer:\n\n1️⃣ Who is exchanging with whom?\n2️⃣ What are they exchanging?\n3️⃣ Could this happen without money?",
      taskMinChars: 50,
      badgeId: "badge-week-1-en",
      cardId: "card-week-1-en",
      published: true,
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  stats.weeks = 1;
  log("  ✓ weeks/1 placeholder 寫好");

  // ---- 3. rewards (1 badge + 1 card placeholder) ----
  log("🏅 寫入 NGFA rewards placeholders...");
  const batch = writeBatch(db);
  batch.set(
    doc(db, "rewards", "badge-week-1-en"),
    {
      rewardId: "badge-week-1-en",
      type: "badge",
      name: "Exchange Explorer",
      description: "Completed Week 1 — understands the basics of exchange",
      weekLabel: "W1",
      chapter: "Ch.1",
      earnedFromWeek: 1,
      earnedVia: "quiz-approval",
      image: "/icon-192.png", // placeholder
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  batch.set(
    doc(db, "rewards", "card-week-1-en"),
    {
      rewardId: "card-week-1-en",
      type: "card",
      name: "The Trade Bottleneck",
      description:
        "Trade starts with: I have something. But matching wants, timing, and value isn't easy.",
      weekLabel: "W1",
      chapter: "Ch.1",
      earnedFromWeek: 1,
      earnedVia: "task-approval",
      image: "/icon-192.png", // placeholder
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await batch.commit();
  stats.rewards = 2;
  log(`  ✓ ${stats.rewards} placeholder rewards 寫好`);

  log("");
  log(`✅ NGFA seed 完成：${JSON.stringify(stats)}`);
  log("ℹ️  這是 placeholder。實際 NGFA 內容請等 M2 admin UI 做好後從介面編輯。");
  return stats;
}
