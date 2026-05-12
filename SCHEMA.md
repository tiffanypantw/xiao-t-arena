# Firestore Content Schema
**Status:** Draft v1, 2026-05-12
**Author:** Phase 1 foundation work
**Replaces:** Hardcoded `WEEK_DATA` (in WeekLearning.jsx) + `REWARDS` + `WEEKS` + `REDEEM_CODES` (in redeemCodes.js) + `ENCOURAGEMENT_MESSAGES_*` (in admin-config.js)

---

## 1. Goals

把目前寫死在 JS 檔裡的所有「內容」搬到 Firestore，讓：
- Admin UI 可以在後台編輯週次內容、徽章、卡片、兌換碼、品牌設定
- 加新 Week 7、Week 8...... 不需要改 code + deploy
- 中文 Tiffany 兒財 + 英文 NGFA 兩個 brand 用同一份 codebase，各自有獨立內容
- 長期支援 14-15 quarter × 13 週 ≈ 180-200 週的累積規模

---

## 2. 架構決定：每 brand 一個 Firebase project（不是 multi-tenant）

我們已經決定的事：
- `xiao-t-arena` Firebase project = 中文 Tiffany 兒財品牌
- `ngfa-arena` Firebase project = 英文 NGFA 品牌
- Brand 識別**已經由 Firebase project 本身隔離**，資料天然分開

**含意**：Firestore 內部**不需要** `brands` collection 或每個 document 寫 `brand` 欄位。每個 project 裡的 Firestore 就只服務那個 brand。

未來如果某個獨立教育者買了平台，他們也是用自己的 Firebase project。Multi-tenant 在這個架構下，是「多個 Firebase project」的形式，不是「一個 project 多份資料」。

---

## 3. Collections 總覽

每個 Firebase project 裡有 6 個 Firestore collections：

| Collection | 用途 | 規模 |
|---|---|---|
| `brandSettings` | Singleton — 品牌身份、視覺、locale、feature toggle、鼓勵語 | 1 doc |
| `weeks` | 每週的學習內容（問題、quiz、開放題、任務） | 100-200 docs（長期） |
| `rewards` | 徽章 + 卡片元資料（名稱、描述、圖片） | ~400 docs（長期）|
| `redeemCodes` | 兌換碼 → reward 對照 + 使用次數 | 數千 docs（長期）|
| `users` | 學員帳號 + collection（已擁有的 reward） | 不限 |
| `weeklyProgress` | 學員每週的進度（quiz、開放題、任務、對話） | 學員數 × 週數 |

**後 2 個（`users` + `weeklyProgress`）已經存在、schema 不動。** 只有前 4 個是這次要新建的。

---

## 4. Collection 詳細 Schema

### 4.1 `brandSettings/main`（Singleton）

整個 brand 的「全域設定」，doc ID 固定為 `main`。

```js
{
  // 品牌身份
  brandName: "小T 競技場",                    // 短名（PWA short_name、瀏覽器 tab）
  brandFullName: "小T的財商概念競技場",       // 完整名（landing 頁標題、manifest name）
  brandTagline: "每週一個大問題，讓孩子學會思考金錢與價值",
  teacherName: "Tiffany 老師",                // 對話 thread 上顯示
  teacherEmoji: "👩‍🏫",                       // 老師訊息前綴
  
  // Locale + 文化
  locale: "zh-TW",                            // "zh-TW" / "en-US"
  
  // 視覺
  logoUrl: "/images/logo.png",                // 或 Firebase Storage URL
  iconUrl: "/icon-192.png",
  themeColor: "#7c3aed",                      // PWA theme color + manifest
  backgroundColor: "#f5f0eb",                 // PWA background
  
  // Theme tokens（給 :root CSS variables 用，HSL 格式對齊 tailwind shadcn）
  themeTokens: {
    primary: "262 80% 55%",
    secondary: "30 90% 55%",
    accent: "150 60% 45%",
    background: "260 30% 98%",
    foreground: "260 25% 12%",
    // ...其他從 index.css :root 抽出來的
  },
  
  // 課程設定
  latestAvailableWeek: 6,                     // 學員最多能看到第幾週（鎖未完成內容用）
  weeksPerQuarter: 13,                        // Quarter 分組長度（admin 可改，預設 13）
  
  // Feature toggles
  features: {
    showRedeemCodes: true,                    // Passport 顯示「輸入兌換碼」按鈕
    showVDPractice: true,                     // Home 顯示「VD-0419 直播限定」區塊
    enableImageUpload: true,                  // 任務區允許上傳圖片
    enableVideo: false,                       // 週次頁顯示影片 embed（NGFA 會開）
  },
  
  // 鼓勵語清單（管理員審核時可選）
  encouragementMessages: {
    quiz: [                                   // W1-W4 練習題全對版
      "你都答對了，看得出有認真讀 📖",
      // ...
    ],
    open: [                                   // W5+ 開放題版
      "你的觀察很細心 ✨",
      // ...
    ],
  },
  
  updatedAt: serverTimestamp,
}
```

### 4.2 `weeks/{weekNumber}`

每個 week 一個 doc，**doc ID 用週次數字字串**（"1"、"2"、...、"195"）方便排序與引用。

```js
{
  weekNumber: 1,                              // 數字版本（filter / sort 用）
  title: "Week 1",                            // 顯示用
  
  // 學期 / 章節組織（給 admin UI 跟學員 Home 頁分組用）
  quarter: 1,                                 // Q1 / Q2 / ... / Q15
  chapter: "Ch.1",                            // 章節標籤（顯示在卡片上）
  
  // 核心問題
  question: "如果世界沒有錢，真的會更公平嗎？",
  
  // 三關制配置
  hasQuiz: true,
  hasOpenQuestion: false,                     // Week 1-4 是 false，Week 5+ 看設計
  hasTask: true,
  
  // 影片 embed（optional，新功能）
  videoUrl: null,                             // YouTube/Vimeo URL；null = 不顯示影片區
  videoCaption: null,                         // optional 影片下方說明
  
  // 練習題（保持目前的 multiple_choice 結構，未來可擴充其他類型）
  quizQuestions: [
    {
      id: 1,
      block: "基礎理解",                      // 題組標籤（顯示用）
      type: "multiple_choice",                // 未來：drag_classify / find_different / etc.
      question: "...",
      options: ["...", "...", "...", "..."],
      answer: "...",
      explanation: "...",
    },
    // ... 10 題
  ],
  
  // 開放題（hasOpenQuestion: true 時用）
  openQuestion: null,                         // "回想一次你最近的消費，它是..."
  openQuestionMinChars: 30,                   // 最少字數要求
  
  // 任務
  taskTitle: "本週任務",
  taskDescription: "🎯 拍下 3 個...",         // 含 emoji + 換行的長文
  taskMinChars: 50,                           // 任務回應最少字數
  
  // Reward 連結
  badgeId: "badge-exchange-questioner",       // 學員「練習題完成 → 老師審核 → 拿徽章」
  cardId: "card-exchange-bottleneck",         // 學員「任務完成 → 老師審核 → 拿卡片」
  
  // 發佈狀態
  published: true,                            // false = 隱藏 (即使 latestAvailableWeek 涵蓋)
  publishedAt: serverTimestamp,
  
  createdAt: serverTimestamp,
  updatedAt: serverTimestamp,
}
```

### 4.3 `rewards/{rewardId}`

徽章與卡片的元資料。**doc ID 保持目前的 kebab-case ID**（如 `badge-exchange-questioner`），因為已經被 `users.collection` 大量引用，動不得。

```js
{
  rewardId: "badge-exchange-questioner",      // 跟 doc ID 一致
  type: "badge",                              // "badge" | "card"
  name: "交換提問者",
  description: "完成 Week 1 財商概念測驗，理解交換的本質",
  
  // 顯示用 metadata
  weekLabel: "W1",                            // "W1" / "直播限定" / "起步" / "Special"
  chapter: "Ch.1",                            // 跟 weeks.chapter 對齊
  
  // 來源
  earnedFromWeek: 1,                          // 哪一週發出，null = 特別獎（直播、起步）
  earnedVia: "quiz-approval",                 // "quiz-approval" | "open-answer-approval" | 
                                              // "task-approval" | "redeem-code-only"
  
  // 視覺
  image: "/images/W1 交換提問者.png",          // local path 或 Firebase Storage URL
  
  createdAt: serverTimestamp,
  updatedAt: serverTimestamp,
}
```

### 4.4 `redeemCodes/{code}`

每個碼一個 doc，**doc ID = code 字串本身**（如 `B-EQ-K1U8`）。

```js
{
  code: "B-EQ-K1U8",                          // 跟 doc ID 一致
  rewardId: "badge-exchange-questioner",
  type: "badge",                              // denormalized from reward
  maxUses: 5,                                 // 用完就鎖
  uses: 0,                                    // 當前已用次數（atomic increment）
  
  // 管理用
  generatedFor: "Week 1 直播",                // 老師備註：這批碼發給誰/什麼活動
  expiresAt: null,                            // 未來功能；null = 不過期
  
  createdAt: serverTimestamp,
}
```

---

## 5. 三個重要的設計選擇 + 為什麼

### 5.1 為什麼不用 subcollection（如 `weeks/{n}/quizQuestions/{id}`）

把 quiz questions 拆成 subcollection 看起來「更正規化」，但實際上：
- 每週 quiz 都會一起讀（學員打開週次頁要看完整 10 題）
- 拆 subcollection 等於每次要做 10 個額外 read
- Firestore 計費按 read 數，這會 10x 你的成本
- 而且 quiz 題目編輯時也是整週一起改，沒有獨立編輯單題的需求

**結論：quiz questions 內嵌在 week document 裡，當 array 處理。** 同理 `encouragementMessages` 內嵌在 `brandSettings`。

### 5.2 為什麼 `weeks.badgeId` / `cardId` 是 reference 不是內嵌

徽章被多個地方引用：
- Week document 引用（這週發哪個徽章）
- User collection 引用（學員擁有哪些徽章）
- Passport 頁面顯示徽章 detail

如果內嵌在 week，user collection 就只能存 ID，要顯示徽章名稱還是要 cross-read week → 等於沒省到。**reference + 獨立 `rewards` collection 最乾淨。**

### 5.3 為什麼不存 quiz 答題歷史

學員每次答錯不會 log。只記錄「最終全對」的狀態（existing `weeklyProgress.quizCompleted`）。

理由：(1) 答題 retry log 沒人會看，(2) 寫入頻繁很燒 Firestore 操作數，(3) 你也沒在做學習分析。**如果未來要 analytics 才加。**

---

## 6. 學員端讀取流程（搬到 Firestore 後）

| 場景 | 讀取 | 快取策略 |
|---|---|---|
| 任何頁面 mount | `brandSettings/main` × 1 | TanStack Query, staleTime = 1 hour |
| Home 頁 | `weeks` where `published=true` and `weekNumber <= latestAvailableWeek` | staleTime = 5 min |
| WeekLearning | `weeks/{n}` × 1 + `rewards/{badgeId}` + `rewards/{cardId}` | staleTime = 5 min |
| Passport | `rewards` 全部 + `users/{uid}.collection` | staleTime = 5 min |
| Admin UI | `weeks` 全部（含未發佈）+ `rewards` 全部 | staleTime = 0（每次重讀） |
| Redeem code 流程 | `redeemCodes/{code}` × 1 | 不快取 |

**長期擴張到 200 週後**：Home + Passport 那兩個全讀的地方會變慢。屆時需要按 quarter 分頁讀（"只讀我當前 quarter ± 1"）。Phase 1 不解決這個問題，**但 schema 預留 quarter 欄位就是為了這個**。

---

## 7. 從 hardcoded 搬遷到 Firestore 的計畫（M1.6 會做的事）

**Migration script 大概長這樣：**

```js
// scripts/migrate-content.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { WEEKS, REWARDS, REDEEM_CODES } from "../src/lib/redeemCodes.js";
import { ENCOURAGEMENT_MESSAGES_QUIZ, ENCOURAGEMENT_MESSAGES_OPEN } from "../src/lib/admin-config.js";
import { WEEK_DATA } from "../src/pages/WeekLearning.jsx";  // need to extract

// 1. 寫 brandSettings/main
await setDoc(doc(db, "brandSettings", "main"), { /* ... */ });

// 2. 寫每個 week
for (const week of WEEKS) {
  const data = WEEK_DATA[week.weekNumber];
  await setDoc(doc(db, "weeks", String(week.weekNumber)), { /* merge week + data */ });
}

// 3. 寫每個 reward
for (const [id, r] of Object.entries(REWARDS)) {
  await setDoc(doc(db, "rewards", id), { /* ... */ });
}

// 4. 寫每個 redeem code
for (const [code, c] of Object.entries(REDEEM_CODES)) {
  await setDoc(doc(db, "redeemCodes", code), { /* ... */, uses: 0 });
}
```

跑一次 → Tiffany Firestore 有資料 → 重跑針對 NGFA 但用空/翻譯內容 → NGFA Firestore 也準備好。

---

## 8. 不在 Phase 1 範圍

- **內容版本控制 / 編輯歷史**：如果 Week 5 編輯後，已完成學員看到的是新版還是舊版？**答：永遠看最新版。** 不做版本快照、不做 audit log。
- **多老師後台帳號**：目前 `ADMIN_EMAILS` 只有 Tiffany 一個。未來如果某個獨立教育者買了平台、要邀請助教，再做。
- **Quiz 題型擴充**：新增 drag-classify / find-different / etc. 的 admin UI 編輯器。Phase 1 admin UI 只支援 `multiple_choice`，未來再擴充。
- **Reward 圖片上傳到 Storage**：M1 階段 reward.image 還是用 `/images/...` 本地路徑。圖片 admin UI + Storage 上傳延後到 M3。

---

## 9. 決議記錄（Tiffany 2026-05-12 確認）

1. ✅ **`brandSettings.encouragementMessages` 放在 brandSettings 裡**——未來如果類型變多再考慮拆出獨立 collection。
2. ✅ **`weeks.quizQuestions[].block` 保持自由字串**——admin UI 編輯時提供「常用 block」快選 dropdown，但允許自訂。
3. ✅ **Quarter 預設 13 週**——`brandSettings.weeksPerQuarter` 預設 13，admin 可改。
4. ✅ **`weekToBadge` / `weekToCard` 對照表搬掉**——M1.7 refactor 時改成從 `weeks.badgeId` / `cardId` 反查；舊對照表刪除。
